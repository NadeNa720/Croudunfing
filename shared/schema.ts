import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ====================== DATABASE TABLES ======================
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable(
  "bookings",
  {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    service: text("service").notNull(),
    area: text("area").notNull(),
    windowOption: text("window_option"),
    date: text("date").notNull(),
    time: text("time").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone").notNull(),
    email: text("email").notNull(),
    address: text("address").notNull(),
    additionalInfo: text("additional_info"),
    price: decimal("price", { precision: 8, scale: 2 }).notNull(),
    duration: text("duration").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      // Prevent double booking for the exact same start date & time
      bookingDateTimeUnique: uniqueIndex("booking_date_time_unique").on(
        table.date,
        table.time,
      ),
    };
  },
);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

// ====================== FRONTEND SERVICE STRUCTURE ======================
export interface ServiceOption {
  id: string;
  name: string;
  description: string;
  areas: {
    [key: string]: {
      duration: string;
      price: number;
      options?: {
        standard?: { duration: string; price: number };
        nonStandard?: { duration: string; price: number };
      };
    };
  };
  details?: string;
  badge?: string;
}

// ====================== CLEANING SERVICES ======================
export const CLEANING_SERVICES: ServiceOption[] = [
  {
    id: "basic",
    name: "Sprzątanie podstawowe (pakiet srebrny)",
    description: "Kompleksowe sprzątanie mieszkania według standardu srebrnego",
    badge: "Srebrny",
    areas: {
      "do 30 m²": {
        duration: "3 godz.",
        price: 399.99,
        options: {
          standard: { duration: "4 godz.", price: 499.99 },
          nonStandard: { duration: "5 godz. 30 min", price: 699.99 },
        },
      },
      "do 60 m²": {
        duration: "4 godz.",
        price: 479.99,
        options: {
          standard: { duration: "5 godz. 30 min", price: 699.99 },
          nonStandard: { duration: "6 godz. 30 min", price: 799.99 },
        },
      },
      "do 90 m²": {
        duration: "6 godz.",
        price: 799.99,
        options: {
          standard: { duration: "7 godz. 30 min", price: 899.99 },
          nonStandard: { duration: "8 godz. 30 min", price: 1099.99 },
        },
      },
      "do 120 m²": {
        duration: "7 godz.",
        price: 899.99,
        options: {
          standard: { duration: "8 godz.", price: 999.99 },
          nonStandard: { duration: "9 godz. 30 min", price: 1099.99 },
        },
      },
    },
    details: `
<ul class="list-disc pl-5 space-y-1">
  <li>Odkurzanie podłóg i listew podłogowych</li>
  <li>Mycie podłóg i listew podłogowych</li>
  <li>Wycieranie kurzu z łatwo dostępnych powierzchni: parapety, oświetlenie (w miarę możliwości), grzejniki, kontakty</li>
  <li>Łazienka: armatura, kabina prysznicowa/wanna, umywalka, sedes</li>
  <li>Kuchnia: umycie lub wstawienie naczyń do zmywarki, blaty, zlew, AGD z zewnątrz</li>
  <li>Opróżnianie koszy na śmieci, mycie luster</li>
  <li>Mycie podłogi balkonu/tarasu do 4 m²</li>
  <li>Profesjonalne środki czystości w cenie</li>
  <li>Sprzątanie maksymalnie do wysokości 2 m</li>
</ul>
    `,
  },
  {
    id: "comprehensive",
    name: "Sprzątanie kompleksowe (pakiet platynowy)",
    description: "Najwyższej jakości sprzątanie z dodatkowymi usługami",
    badge: "Platynowy",
    areas: {
      "do 30 m²": {
        duration: "5 godz.",
        price: 599.99,
      },
      "do 60 m²": {
        duration: "6 godz.",
        price: 899.99,
        options: {
          standard: { duration: "7 godz. 30 min", price: 1099.99 },
          nonStandard: { duration: "8 godz. 30 min", price: 1199.99 },
        },
      },
      "do 90 m²": {
        duration: "8 godz.",
        price: 1199.99,
        options: {
          standard: { duration: "9 godz. 30 min", price: 1299.99 },
        },
      },
      "do 120 m²": {
        duration: "9 godz.",
        price: 1099.99,
        options: {
          standard: { duration: "11 godz.", price: 1499.99 },
          nonStandard: { duration: "12 godz. 30 min", price: 1599.99 },
        },
      },
    },
    details: `
<ul class="list-disc pl-5 space-y-1">
  <li>Wszystko z pakietu Srebrnego, a dodatkowo:</li>
  <li>Kuchnia: mycie piekarnika, lodówki, kuchenki mikrofalowej</li>
  <li>Łazienka: mycie glazury łazienkowej</li>
  <li>Mycie podłogi balkonu/tarasu</li>
  <li>Profesjonalne środki czystości w cenie</li>
  <li>Sprzątanie maksymalnie do wysokości 2 m</li>
</ul>
    `,
  },
  {
    id: "postRenovation",
    name: "Poremontowe sprzątanie mieszkań",
    description: "Specjalistyczne sprzątanie po zakończonych pracach remontowych",
    areas: {
      "do 30 m²": { duration: "6 godz.", price: 599.99 },
      "do 60 m²": { duration: "11 godz.", price: 1199.99 },
      "do 90 m²": { duration: "1 dzień 8 godz.", price: 1599.99 },
      "do 120 m²": { duration: "2 dni", price: 1799.99 },
    },
  },
  {
    id: "shortTerm",
    name: "Serwis apartamentów na wynajem krótkoterminowy",
    description: "Dla klientów z umową - wycena indywidualna",
    areas: {
      "do 35 m²": { duration: "3 godz.", price: 0 },
      "do 60 m²": { duration: "4 godz.", price: 0 },
    },
  },
  {
    id: "custom",
    name: "Niestandardowa usługa sprzątania",
    description: "Dostosowana do indywidualnych potrzeb",
    areas: {
      "wycena indywidualna": { duration: "8 godz.", price: 0 },
    },
  },
];
