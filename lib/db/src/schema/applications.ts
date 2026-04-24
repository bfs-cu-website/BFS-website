import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  department: text("department").notNull(),
  year: text("year").notNull(),
  interests: text("interests").notNull(),
  essay: text("essay").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const ALLOWED_YEARS = ["1st", "2nd", "3rd", "4th", "pg1", "pg2"] as const;

export const insertApplicationSchema = createInsertSchema(applicationsTable)
  .omit({
    id: true,
    status: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    name: z.string().min(2).max(100),
    email: z.email().max(254),
    department: z.string().min(2).max(200),
    year: z.enum(ALLOWED_YEARS),
    interests: z.string().min(1).max(500),
    essay: z.string().min(50).max(5000),
  });

export const selectApplicationSchema = createSelectSchema(applicationsTable);

export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
