import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, CLEANING_SERVICES } from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { sendCustomerConfirmation, sendBusinessNotification, testEmailConnection } from "./emailService";
import fs from "fs";
import path from "path";

// Helper function to ensure static assets are available in production
function ensureStaticAssets(): boolean {
  if (process.env.NODE_ENV === "production") {
    const distPublic = path.resolve(process.cwd(), "dist", "public");
    const serverPublic = path.resolve(process.cwd(), "server", "public");

    if (fs.existsSync(distPublic)) {
      // Create server/public if it doesn't exist
      if (!fs.existsSync(serverPublic)) {
        fs.mkdirSync(serverPublic, { recursive: true });
      }

      // Copy assets from dist/public to server/public
      try {
        fs.cpSync(distPublic, serverPublic, { recursive: true });
        console.log('✅ Static assets copied to server/public for production serving');

        // Validate that index.html exists after copy
        const indexPath = path.resolve(serverPublic, "index.html");
        if (fs.existsSync(indexPath)) {
          console.log('✅ Static assets validation passed - index.html found');
          return true;
        } else {
          console.error('❌ Static assets validation failed - index.html missing after copy');
          return false;
        }
      } catch (error) {
        console.error('❌ Failed to copy static assets:', error);
        return false;
      }
    } else {
      console.error('❌ dist/public not found - make sure to run build before starting in production');
      return false;
    }
  }
  return true; // In development, assume assets are served by Vite
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure static assets are available for production deployment
  const staticAssetsReady = ensureStaticAssets();

  // If static assets are not ready in production, add fallback route (but preserve API and health endpoints)
  if (process.env.NODE_ENV === "production" && !staticAssetsReady) {
    app.get(/^\/(?!api|health)(.*)/, (req, res) => {
      res.status(503).json({
        error: "Service temporarily unavailable",
        message: "Static assets not found. Please ensure the application was built before deployment.",
        timestamp: new Date().toISOString()
      });
    });
    console.error('🚨 Static assets fallback route registered - frontend will not work until assets are available');
    console.log('ℹ️ API and health endpoints remain accessible during asset outage');
  }

  // Test email connection on startup (with timeout to prevent deployment hanging)
  console.log('🔍 Testing SMTP email connection...');
  try {
    const emailTestPromise = testEmailConnection();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('SMTP test timeout')), 5000)
    );

    await Promise.race([emailTestPromise, timeoutPromise]);
  } catch (error) {
    console.warn('⚠️ SMTP test failed or timed out, continuing with startup:', error instanceof Error ? error.message : String(error));
  }

  // Health check endpoint for deployment verification
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "SprzątanieMieszkań.com"
    });
  });

  // Booking endpoints
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);

      // Validate that the service and area combination exists and get pricing
      const service = CLEANING_SERVICES.find(s => s.id === bookingData.service.split(' - ')[0]);
      if (!service) {
        return res.status(400).json({ error: "Invalid service selected" });
      }

      const area = bookingData.area;
      const serviceArea = service.areas[area];
      if (!serviceArea) {
        return res.status(400).json({ error: "Invalid area for selected service" });
      }

      // Calculate price and duration based on window option
      let finalPrice = serviceArea.price;
      let finalDuration = serviceArea.duration;

      if (bookingData.windowOption && bookingData.windowOption !== 'none' && serviceArea.options) {
        if (bookingData.windowOption === 'standard' && serviceArea.options.standard) {
          finalPrice = serviceArea.options.standard.price;
          finalDuration = serviceArea.options.standard.duration;
        } else if (bookingData.windowOption === 'nonStandard' && serviceArea.options.nonStandard) {
          finalPrice = serviceArea.options.nonStandard.price;
          finalDuration = serviceArea.options.nonStandard.duration;
        }
      }

      // Create booking with calculated price and duration
      const booking = await storage.createBooking({
        ...bookingData,
        price: finalPrice.toString(),
        duration: finalDuration
      });

      // Send email notifications
      try {
        // Send confirmation to customer
        await sendCustomerConfirmation(booking);
        console.log(`✅ Customer confirmation email sent to ${booking.email}`);

        // Send notification to business
        await sendBusinessNotification(booking);
        console.log(`✅ Business notification email sent for booking #${booking.id.substring(0, 8)}`);

        res.status(201).json({
          ...booking,
          message: "Dziękujemy! Twoja rezerwacja została przyjęta. Wysłaliśmy potwierdzenie na Twój adres e-mail."
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Still return successful booking but with email error message
        res.status(201).json({
          ...booking,
          message: "Rezerwacja została przyjęta, jednak wystąpił problem z wysłaniem e-maila potwierdzającego. Skontaktujemy się z Tobą telefonicznie.",
          emailError: true
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ error: validationError.message });
      }
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // First try exact match
      let booking = await storage.getBooking(id);

      // If not found and the ID looks like a shortened UUID (8 chars), try to find by prefix
      // Note: This is kept for testing/development but should be disabled in production for security
      if (!booking && id.length === 8) {
        const allBookings = await storage.getAllBookings();
        booking = allBookings.find(b => b.id.startsWith(id));
      }

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      // In production, this endpoint should be protected and require authentication
      // For the demo/frontend integration, returning full data is acceptable
      // TODO: Add authentication and proper access control
      res.json(booking);
    } catch (error) {
      console.error("Error getting booking:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin endpoint - should be protected with authentication in production
  app.get("/api/bookings", async (req, res) => {
    try {
      // TODO: Add authentication middleware for admin access
      // For now, return minimal data without full PII exposure
      const bookings = await storage.getAllBookings();
      const sanitizedBookings = bookings.map(booking => ({
        id: booking.id,
        service: booking.service,
        area: booking.area,
        windowOption: booking.windowOption,
        date: booking.date,
        time: booking.time,
        price: booking.price,
        duration: booking.duration,
        createdAt: booking.createdAt
        // PII fields (firstName, lastName, phone, email, address) excluded for security
      }));
      res.json(sanitizedBookings);
    } catch (error) {
      console.error("Error getting bookings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Service information endpoint
  app.get("/api/services", async (req, res) => {
    res.json(CLEANING_SERVICES);
  });

  const httpServer = createServer(app);

  return httpServer;
}
