# SprzątanieMieszkań.com

## Overview

SprzątanieMieszkań.com is a Polish cleaning service marketplace application that allows customers to book professional apartment cleaning services online. The platform offers various cleaning packages (Silver and Platinum tiers) with different service levels and pricing based on apartment size. Users can select services, choose dates and times, provide contact information, and receive booking confirmations with pricing details. The application includes features like service comparison, embedded video demonstrations, FAQ sections, and a gift program (scented candles) for completed bookings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses React with TypeScript as the primary frontend framework, built with Vite for fast development and optimized builds. The UI is constructed using Shadcn/UI components with Radix UI primitives for accessibility and consistent design patterns. Tailwind CSS provides utility-first styling with a custom design system focused on trust-building colors (blues) and clean layouts inspired by service marketplaces like Airbnb and Booking.com.

**State Management**: Uses React's built-in state management with hooks for local component state and React Query (TanStack Query) for server state management and API calls.

**Routing**: Implements Wouter as a lightweight client-side routing solution, currently handling the main home page and 404 fallback.

**Component Structure**: Follows a modular component architecture with reusable UI components, page-level components, and example components for development/testing.

### Backend Architecture
The backend is built with Express.js using TypeScript and follows an ESM module structure. It implements a simple HTTP server with middleware for JSON parsing, URL encoding, and request logging. The architecture includes a registration system for API routes (currently placeholder) and proper error handling middleware.

**API Design**: Follows RESTful conventions with routes prefixed under `/api`. The current implementation includes placeholder route handlers ready for CRUD operations.

**Storage Interface**: Implements an abstraction layer for data storage with both in-memory storage (MemStorage) for development and database storage capabilities through the IStorage interface.

### Data Storage Solutions
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations and migrations. The database schema includes:

- **Users table**: Basic user authentication with username/password
- **Bookings table**: Comprehensive booking records including service details, customer information, pricing, and timestamps
- **Service definitions**: Predefined service packages with area-based pricing stored in application code

**Database Configuration**: Uses Neon Database serverless PostgreSQL with connection pooling and environment-based configuration.

**Schema Management**: Drizzle Kit handles database migrations and schema synchronization with TypeScript type generation for compile-time safety.

### Authentication and Authorization
Currently implements a basic user system with username/password authentication structure. The authentication system is prepared for session-based authentication using connect-pg-simple for PostgreSQL session storage, though the full implementation appears to be in development.

### External Dependencies

**Database**: Neon Database (serverless PostgreSQL) for production data storage with Drizzle ORM for database operations and migrations.

**UI Framework**: Shadcn/UI component library built on Radix UI primitives for accessible, customizable components.

**Styling**: Tailwind CSS for utility-first styling with Google Fonts (Inter) for typography.

**Development Tools**: Vite for fast development builds, TypeScript for type safety, and various development utilities including error overlay and cartographer plugins for Replit integration.

**External Services**: YouTube video embedding for service demonstrations and potential future integrations for payment processing and booking management.

**Form Handling**: React Hook Form with Zod resolvers for type-safe form validation and submission.

**Date Management**: date-fns library for date formatting and manipulation in Polish locale.