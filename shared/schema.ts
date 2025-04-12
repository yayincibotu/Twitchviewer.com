import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  twitchId: text("twitch_id"),
  twitchAccessToken: text("twitch_access_token"),
  twitchRefreshToken: text("twitch_refresh_token"),
  rememberedSession: boolean("remembered_session").default(false),
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

// Live Statistics
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  value: integer("value").notNull(),
  icon: text("icon"),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
});

// Success Stories
export const successStories = pgTable("success_stories", {
  id: serial("id").primaryKey(),
  streamerName: text("streamer_name").notNull(),
  streamerAvatar: text("streamer_avatar"),
  platformType: text("platform_type").notNull().default("twitch"),
  beforeCount: integer("before_count").notNull(),
  afterCount: integer("after_count").notNull(),
  growthPercent: integer("growth_percent").notNull(),
  testimonial: text("testimonial").notNull(),
  isVerified: boolean("is_verified").notNull().default(true),
  isVisible: boolean("is_visible").notNull().default(true),
  order: integer("order").notNull().default(0),
});

// FAQ Categories
export const faqCategories = pgTable("faq_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  order: integer("order").notNull().default(0),
});

// FAQ Items
export const faqItems = pgTable("faq_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => faqCategories.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  isSchemaFaq: boolean("is_schema_faq").notNull().default(true),
  order: integer("order").notNull().default(0),
});

// Blog Posts
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image"),
  authorId: integer("author_id").references(() => users.id),
  tags: text("tags").array(),
  publishDate: timestamp("publish_date"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").notNull().default(false),
});

// Security Badges
export const securityBadges = pgTable("security_badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
  order: integer("order").notNull().default(0),
});

// Limited Time Offers
export const limitedTimeOffers = pgTable("limited_time_offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discountPercent: integer("discount_percent").notNull(),
  packageId: integer("package_id").references(() => packages.id),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  couponCode: text("coupon_code"),
  isActive: boolean("is_active").notNull().default(true),
});

// Media Files
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  uploadedAt: timestamp("uploaded_at").notNull().defaultNow(),
  uploadedBy: integer("uploaded_by").references(() => users.id),
});

// Validation Schemas
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

export const insertStatisticSchema = createInsertSchema(statistics).pick({
  name: true,
  value: true,
  icon: true,
  description: true,
  isActive: true,
  order: true,
});

export const insertSuccessStorySchema = createInsertSchema(successStories).pick({
  streamerName: true,
  streamerAvatar: true,
  platformType: true,
  beforeCount: true,
  afterCount: true,
  growthPercent: true,
  testimonial: true,
  isVerified: true,
  isVisible: true,
  order: true,
});

export const insertFaqCategorySchema = createInsertSchema(faqCategories).pick({
  name: true,
  slug: true,
  order: true,
});

export const insertFaqItemSchema = createInsertSchema(faqItems).pick({
  categoryId: true,
  question: true,
  answer: true,
  isSchemaFaq: true,
  order: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  featuredImage: true,
  authorId: true,
  tags: true,
  publishDate: true,
  metaTitle: true,
  metaDescription: true,
  isPublished: true,
});

export const insertSecurityBadgeSchema = createInsertSchema(securityBadges).pick({
  name: true,
  icon: true,
  description: true,
  isActive: true,
  order: true,
});

export const insertLimitedTimeOfferSchema = createInsertSchema(limitedTimeOffers).pick({
  title: true,
  description: true,
  discountPercent: true,
  packageId: true,
  startDate: true,
  endDate: true,
  couponCode: true,
  isActive: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertSeoSettings = z.infer<typeof insertSeoSettingsSchema>;
export type SeoSettings = typeof seoSettings.$inferSelect;

export type InsertStatistic = z.infer<typeof insertStatisticSchema>;
export type Statistic = typeof statistics.$inferSelect;

export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type SuccessStory = typeof successStories.$inferSelect;

export type InsertFaqCategory = z.infer<typeof insertFaqCategorySchema>;
export type FaqCategory = typeof faqCategories.$inferSelect;

export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItems.$inferSelect;

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export type InsertSecurityBadge = z.infer<typeof insertSecurityBadgeSchema>;
export type SecurityBadge = typeof securityBadges.$inferSelect;

export type InsertLimitedTimeOffer = z.infer<typeof insertLimitedTimeOfferSchema>;
export type LimitedTimeOffer = typeof limitedTimeOffers.$inferSelect;

export const insertMediaFileSchema = createInsertSchema(mediaFiles).pick({
  filename: true,
  url: true,
  mimeType: true,
  size: true,
  width: true,
  height: true,
  uploadedBy: true,
});
export type InsertMediaFile = z.infer<typeof insertMediaFileSchema>;
export type MediaFile = typeof mediaFiles.$inferSelect;
