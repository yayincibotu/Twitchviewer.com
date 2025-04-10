import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").notNull().default(false),
  role: text("role").notNull().default("user"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents
  maxViewers: integer("max_viewers").notNull(),
  features: text("features").array().notNull(),
  stripePriceId: text("stripe_price_id").notNull(),
});

export const seoSettings = pgTable("seo_settings", {
  id: serial("id").primaryKey(),
  pageSlug: text("page_slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  focusKeyword: text("focus_keyword").notNull(),
  cornerstoneContent: boolean("cornerstone_content").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const insertPackageSchema = createInsertSchema(packages).pick({
  name: true,
  description: true,
  price: true,
  maxViewers: true,
  features: true,
  stripePriceId: true,
});

export const insertSeoSettingsSchema = createInsertSchema(seoSettings).pick({
  pageSlug: true,
  title: true,
  description: true,
  focusKeyword: true,
  cornerstoneContent: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;
export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;
