import { users, bookings, type User, type InsertUser, type Booking, type InsertBooking } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Storage interface for all CRUD operations
export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Booking operations
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getAllBookings(): Promise<Booking[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    try {
      const [booking] = await db
        .insert(bookings)
        .values(insertBooking)
        .returning();
      return booking;
    } catch (error: any) {
      // Handle unique constraint violation for (date, time) to prevent double booking
      if (error && typeof error === "object" && "code" in error && error.code === "23505") {
        const conflictError = new Error(
          "Wybrany termin jest już zajęty. Prosimy wybrać inną godzinę.",
        );
        // Attach HTTP status so the route handler can return a proper response
        (conflictError as any).status = 409;
        throw conflictError;
      }

      throw error;
    }
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }
}

export const storage = new DatabaseStorage();
