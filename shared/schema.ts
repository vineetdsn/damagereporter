import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referenceNumber: varchar("reference_number").notNull().unique(),
  
  // Vehicle Information
  licensePlate: text("license_plate").notNull(),
  vin: text("vin"),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: text("year").notNull(),
  color: text("color"),
  
  // Incident Details
  incidentDate: text("incident_date").notNull(),
  incidentTime: text("incident_time"),
  location: text("location"),
  description: text("description").notNull(),
  
  // Reporter Information
  reporterName: text("reporter_name").notNull(),
  reporterPhone: text("reporter_phone").notNull(),
  reporterEmail: text("reporter_email").notNull(),
  
  // Photos and Files
  photoUrls: json("photo_urls").notNull().$type<string[]>().default([]),
  
  // System Fields
  status: text("status").notNull().default("submitted"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  referenceNumber: true,
  createdAt: true,
}).extend({
  licensePlate: z.string().min(1, "License plate is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required").max(4),
  incidentDate: z.string().min(1, "Incident date is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  reporterName: z.string().min(1, "Reporter name is required"),
  reporterPhone: z.string().min(1, "Contact number is required"),
  reporterEmail: z.string().email("Valid email address is required"),
  photoUrls: z.array(z.string()).min(1, "At least one photo is required").max(10, "Maximum 10 photos allowed"),
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
