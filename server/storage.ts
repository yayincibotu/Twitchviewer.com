import { randomBytes } from "crypto";
import { 
  users, type User, type InsertUser, 
  packages, type Package, type InsertPackage, 
  seoSettings, type SeoSettings, type InsertSeoSettings,
  statistics, type Statistic, type InsertStatistic,
  successStories, type SuccessStory, type InsertSuccessStory,
  faqCategories, type FaqCategory, type InsertFaqCategory,
  faqItems, type FaqItem, type InsertFaqItem,
  blogPosts, type BlogPost, type InsertBlogPost,
  securityBadges, type SecurityBadge, type InsertSecurityBadge,
  limitedTimeOffers, type LimitedTimeOffer, type InsertLimitedTimeOffer,
  mediaFiles, type MediaFile, type InsertMediaFile
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { db, pool } from "./db";
import { eq, and, isNull, gte, lt } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByTwitchId(twitchId: string): Promise<User | undefined>;
  getUserByPasswordResetToken(token: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  verifyUserEmail(id: number): Promise<User | undefined>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined>;
  setPasswordResetToken(email: string): Promise<{ token: string, expires: Date } | undefined>;
  resetPassword(token: string, newPassword: string): Promise<User | undefined>;
  createOrUpdateTwitchUser(twitchData: { twitchId: string, username: string, email: string, accessToken: string, refreshToken: string }): Promise<User>;
  updateRememberedSession(id: number, remembered: boolean): Promise<User | undefined>;
  
  // Package operations
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: number, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: number): Promise<boolean>;
  
  // SEO Settings operations
  getSeoSettings(pageSlug: string): Promise<SeoSettings | undefined>;
  getAllSeoSettings(): Promise<SeoSettings[]>;
  createSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings>;
  updateSeoSettings(id: number, settings: Partial<InsertSeoSettings>): Promise<SeoSettings | undefined>;
  
  // Statistics operations
  getStatistics(): Promise<Statistic[]>;
  getActiveStatistics(): Promise<Statistic[]>;
  getStatistic(id: number): Promise<Statistic | undefined>;
  createStatistic(statistic: InsertStatistic): Promise<Statistic>;
  updateStatistic(id: number, statistic: Partial<InsertStatistic>): Promise<Statistic | undefined>;
  deleteStatistic(id: number): Promise<boolean>;
  
  // Success Stories operations
  getSuccessStories(): Promise<SuccessStory[]>;
  getVisibleSuccessStories(): Promise<SuccessStory[]>;
  getSuccessStory(id: number): Promise<SuccessStory | undefined>;
  createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory>;
  updateSuccessStory(id: number, story: Partial<InsertSuccessStory>): Promise<SuccessStory | undefined>;
  deleteSuccessStory(id: number): Promise<boolean>;
  
  // FAQ operations
  getFaqCategories(): Promise<FaqCategory[]>;
  getFaqCategory(id: number): Promise<FaqCategory | undefined>;
  createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory>;
  updateFaqCategory(id: number, category: Partial<InsertFaqCategory>): Promise<FaqCategory | undefined>;
  deleteFaqCategory(id: number): Promise<boolean>;
  
  getFaqItems(): Promise<FaqItem[]>;
  getFaqItemsByCategory(categoryId: number): Promise<FaqItem[]>;
  getFaqItem(id: number): Promise<FaqItem | undefined>;
  createFaqItem(item: InsertFaqItem): Promise<FaqItem>;
  updateFaqItem(id: number, item: Partial<InsertFaqItem>): Promise<FaqItem | undefined>;
  deleteFaqItem(id: number): Promise<boolean>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Security Badges operations
  getSecurityBadges(): Promise<SecurityBadge[]>;
  getActiveSecurityBadges(): Promise<SecurityBadge[]>;
  getSecurityBadge(id: number): Promise<SecurityBadge | undefined>;
  createSecurityBadge(badge: InsertSecurityBadge): Promise<SecurityBadge>;
  updateSecurityBadge(id: number, badge: Partial<InsertSecurityBadge>): Promise<SecurityBadge | undefined>;
  deleteSecurityBadge(id: number): Promise<boolean>;
  
  // Limited Time Offers operations
  getLimitedTimeOffers(): Promise<LimitedTimeOffer[]>;
  getActiveLimitedTimeOffers(): Promise<LimitedTimeOffer[]>;
  getLimitedTimeOffer(id: number): Promise<LimitedTimeOffer | undefined>;
  createLimitedTimeOffer(offer: InsertLimitedTimeOffer): Promise<LimitedTimeOffer>;
  updateLimitedTimeOffer(id: number, offer: Partial<InsertLimitedTimeOffer>): Promise<LimitedTimeOffer | undefined>;
  deleteLimitedTimeOffer(id: number): Promise<boolean>;
  
  // Media Files operations
  getMediaFiles(): Promise<MediaFile[]>;
  getMediaFilesByUser(userId: number): Promise<MediaFile[]>;
  getMediaFile(id: number): Promise<MediaFile | undefined>;
  createMediaFile(file: InsertMediaFile): Promise<MediaFile>;
  deleteMediaFile(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: any;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private seoSettings: Map<number, SeoSettings>;
  private statistics: Map<number, Statistic>;
  private successStories: Map<number, SuccessStory>;
  private faqCategories: Map<number, FaqCategory>;
  private faqItems: Map<number, FaqItem>;
  
  // Add missing methods required by IStorage interface
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  private blogPosts: Map<number, BlogPost>;
  private securityBadges: Map<number, SecurityBadge>;
  private limitedTimeOffers: Map<number, LimitedTimeOffer>;
  private mediaFiles: Map<number, MediaFile>;
  
  sessionStore: any;
  currentUserId: number;
  currentPackageId: number;
  currentSeoSettingsId: number;
  currentStatisticId: number;
  currentSuccessStoryId: number;
  currentFaqCategoryId: number;
  currentFaqItemId: number;
  currentBlogPostId: number;
  currentSecurityBadgeId: number;
  currentLimitedTimeOfferId: number;
  currentMediaFileId: number;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.seoSettings = new Map();
    this.statistics = new Map();
    this.successStories = new Map();
    this.faqCategories = new Map();
    this.faqItems = new Map();
    this.blogPosts = new Map();
    this.securityBadges = new Map();
    this.limitedTimeOffers = new Map();
    this.mediaFiles = new Map();
    
    this.currentUserId = 1;
    this.currentPackageId = 1;
    this.currentSeoSettingsId = 1;
    this.currentStatisticId = 1;
    this.currentSuccessStoryId = 1;
    this.currentFaqCategoryId = 1;
    this.currentFaqItemId = 1;
    this.currentBlogPostId = 1;
    this.currentSecurityBadgeId = 1;
    this.currentLimitedTimeOfferId = 1;
    this.currentMediaFileId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize with default packages
    const defaultPackages: InsertPackage[] = [
      {
        name: "Starter",
        description: "Perfect for new streamers looking to grow their audience.",
        price: 1900, // $19.00
        maxViewers: 50,
        features: ["Up to 50 Viewers", "Basic Analytics", "Email Support"],
        stripePriceId: "price_starter",
      },
      {
        name: "Professional",
        description: "For established streamers wanting to reach the next level.",
        price: 4900, // $49.00
        maxViewers: 200,
        features: ["Up to 200 Viewers", "Advanced Analytics", "Priority Support", "Channel Optimization"],
        stripePriceId: "price_professional",
      },
      {
        name: "Enterprise",
        description: "For serious streamers and professional content creators.",
        price: 9900, // $99.00
        maxViewers: 500,
        features: ["Up to 500 Viewers", "Premium Analytics", "24/7 Priority Support", "Custom Solutions"],
        stripePriceId: "price_enterprise",
      }
    ];
    
    defaultPackages.forEach(pkg => this.createPackage(pkg));
    
    // Initialize with default SEO settings
    const defaultSeoSettings: InsertSeoSettings[] = [
      {
        pageSlug: "home",
        title: "TwitchViewer.com - Boost Your Twitch Channel with Real Viewers",
        description: "Grow your channel naturally using our automated Twitch viewer system. Increase your visibility and reach more followers.",
        focusKeyword: "twitch viewers, twitch growth, boost twitch channel",
        cornerstoneContent: true,
      },
      {
        pageSlug: "features",
        title: "Features - TwitchViewer.com",
        description: "Discover all the features that make TwitchViewer the best solution to grow your Twitch channel.",
        focusKeyword: "twitch viewer features, twitch growth tools",
        cornerstoneContent: false,
      },
      {
        pageSlug: "pricing",
        title: "Pricing - TwitchViewer.com",
        description: "Affordable packages to boost your Twitch channel growth with real viewers.",
        focusKeyword: "twitch viewer pricing, twitch viewers cost",
        cornerstoneContent: false,
      }
    ];
    
    defaultSeoSettings.forEach(settings => this.createSeoSettings(settings));
    
    // Initialize with default statistics
    const defaultStatistics: InsertStatistic[] = [
      {
        name: "Active Viewers",
        value: 15462,
        icon: "users",
        description: "Currently online viewers across all platforms",
        isActive: true,
        order: 1
      },
      {
        name: "Successful Streams",
        value: 27849,
        icon: "video",
        description: "Streams successfully boosted last month",
        isActive: true,
        order: 2
      },
      {
        name: "Average Growth",
        value: 284,
        icon: "trending-up",
        description: "Average viewer increase per stream",
        isActive: true,
        order: 3
      },
      {
        name: "Client Satisfaction",
        value: 98,
        icon: "heart",
        description: "Percentage of satisfied customers",
        isActive: true,
        order: 4
      }
    ];
    
    defaultStatistics.forEach(stat => this.createStatistic(stat));
    
    // Initialize with default success stories
    const defaultSuccessStories: InsertSuccessStory[] = [
      {
        streamerName: "GameMasterX",
        streamerAvatar: "https://i.pravatar.cc/150?img=1",
        platformType: "twitch",
        beforeCount: 45,
        afterCount: 312,
        growthPercent: 593,
        testimonial: "TwitchViewer completely changed my streaming career! I went from having just a few viewers to hundreds in just two weeks!",
        isVerified: true,
        isVisible: true,
        order: 1
      },
      {
        streamerName: "EpicStreamQueen",
        streamerAvatar: "https://i.pravatar.cc/150?img=5",
        platformType: "twitch",
        beforeCount: 27,
        afterCount: 189,
        growthPercent: 600,
        testimonial: "I was about to quit streaming until I found TwitchViewer. Now I'm partnered and making a living from my streams!",
        isVerified: true,
        isVisible: true,
        order: 2
      },
      {
        streamerName: "ProGamerLife",
        streamerAvatar: "https://i.pravatar.cc/150?img=3",
        platformType: "youtube",
        beforeCount: 68,
        afterCount: 437,
        growthPercent: 542,
        testimonial: "The most reliable viewer service I've ever used. Consistent results and excellent support team!",
        isVerified: true,
        isVisible: true,
        order: 3
      }
    ];
    
    defaultSuccessStories.forEach(story => this.createSuccessStory(story));
    
    // Initialize with default FAQ categories and items
    const generalCategory = this.createFaqCategory({
      name: "General Questions",
      slug: "general",
      order: 1
    });
    
    const technicalCategory = this.createFaqCategory({
      name: "Technical Information",
      slug: "technical",
      order: 2
    });
    
    const billingCategory = this.createFaqCategory({
      name: "Billing & Payments",
      slug: "billing",
      order: 3
    });
    
    const defaultFaqItems: InsertFaqItem[] = [
      {
        categoryId: generalCategory.id,
        question: "What is TwitchViewer.com?",
        answer: "TwitchViewer.com is a professional service that helps Twitch streamers grow their audience by boosting viewer counts, which improves channel visibility and ranking in Twitch's recommendation algorithm.",
        isSchemaFaq: true,
        order: 1
      },
      {
        categoryId: generalCategory.id,
        question: "Is using TwitchViewer against Twitch's Terms of Service?",
        answer: "Our service provides genuine viewer traffic to help you grow naturally. We focus on boosting your initial viewership to help you become more discoverable to genuine viewers who will enjoy your content.",
        isSchemaFaq: true,
        order: 2
      },
      {
        categoryId: technicalCategory.id,
        question: "How do I set up TwitchViewer for my channel?",
        answer: "Setting up is simple! Just create an account, choose your package, and enter your channel name. Our system will automatically start generating viewers for your streams within minutes.",
        isSchemaFaq: true,
        order: 1
      },
      {
        categoryId: technicalCategory.id,
        question: "Will the viewers interact with my channel?",
        answer: "Our service focuses on providing viewer count. While our viewers don't typically chat, the increased viewer count will attract real users who will engage with your content.",
        isSchemaFaq: true,
        order: 2
      },
      {
        categoryId: billingCategory.id,
        question: "Are there any long-term contracts?",
        answer: "No, all our packages are subscription-based with monthly billing. You can cancel anytime without penalties or hidden fees.",
        isSchemaFaq: true,
        order: 1
      },
      {
        categoryId: billingCategory.id,
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and cryptocurrency payments including Bitcoin and Ethereum for maximum privacy and convenience.",
        isSchemaFaq: true,
        order: 2
      }
    ];
    
    defaultFaqItems.forEach(item => this.createFaqItem(item));
    
    // Initialize with default security badges
    const defaultSecurityBadges: InsertSecurityBadge[] = [
      {
        name: "256-bit SSL Encryption",
        icon: "lock",
        description: "All data is securely transmitted with 256-bit SSL encryption",
        isActive: true,
        order: 1
      },
      {
        name: "PCI DSS Compliant",
        icon: "credit-card",
        description: "Payment processing meets PCI DSS Level 1 requirements",
        isActive: true,
        order: 2
      },
      {
        name: "GDPR Compliant",
        icon: "shield",
        description: "Your data is handled in compliance with GDPR regulations",
        isActive: true,
        order: 3
      },
      {
        name: "24/7 Fraud Monitoring",
        icon: "eye",
        description: "Continuous monitoring for suspicious activities",
        isActive: true,
        order: 4
      }
    ];
    
    defaultSecurityBadges.forEach(badge => this.createSecurityBadge(badge));
    
    // Create a default limited time offer
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const defaultLimitedTimeOffer: InsertLimitedTimeOffer = {
      title: "Launch Special: 30% Off Professional Plan",
      description: "Get our Professional plan with 30% discount for your first 3 months. Limited time offer!",
      discountPercent: 30,
      packageId: 2, // Professional package 
      startDate: now,
      endDate: oneWeekLater,
      couponCode: "LAUNCH30",
      isActive: true
    };
    
    this.createLimitedTimeOffer(defaultLimitedTimeOffer);
    
    // Create a default blog post
    const defaultBlogPost: InsertBlogPost = {
      title: "5 Proven Strategies to Grow Your Twitch Audience",
      slug: "5-proven-strategies-grow-twitch-audience",
      excerpt: "Learn the top strategies that successful Twitch streamers use to grow their audiences and build engaged communities.",
      content: `
# 5 Proven Strategies to Grow Your Twitch Audience

Growing your audience on Twitch requires a combination of consistency, quality content, and smart promotion. Here are five proven strategies that can help you increase your viewership and build an engaged community.

## 1. Stream Consistently

One of the most important factors in growing your Twitch channel is consistency. Create a regular streaming schedule and stick to it. When viewers know when to expect your streams, they're more likely to come back regularly.

## 2. Optimize Your Stream Quality

Invest in good equipment to ensure your streams look and sound professional. This includes:
- A decent microphone
- Proper lighting
- Stable internet connection
- Optimized encoding settings

## 3. Engage With Your Audience

Interact with your viewers through chat. Acknowledge new followers and subscribers. Create a welcoming environment where viewers feel appreciated and part of the community.

## 4. Network With Other Streamers

Collaborate with other streamers of similar size to cross-promote each other's channels. Participate in gaming communities and forums to increase your visibility.

## 5. Leverage Social Media

Promote your streams on social media platforms. Share highlights, announce upcoming streams, and engage with your audience outside of Twitch.

By implementing these strategies consistently, you'll be well on your way to growing a thriving Twitch community!
      `,
      featuredImage: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80",
      authorId: null,
      tags: ["growth", "twitch", "streaming", "audience"],
      publishDate: new Date(),
      metaTitle: "5 Proven Strategies to Grow Your Twitch Audience | TwitchViewer.com",
      metaDescription: "Discover five proven strategies that successful streamers use to grow their Twitch audience and build engaged communities.",
      isPublished: true
    };
    
    this.createBlogPost(defaultBlogPost);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }
  
  async getUserByTwitchId(twitchId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.twitchId === twitchId,
    );
  }
  
  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.passwordResetToken === token && 
      user.passwordResetExpires && 
      new Date(user.passwordResetExpires) > new Date(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      emailVerified: false, 
      role: "user",
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      passwordResetToken: null,
      passwordResetExpires: null,
      twitchId: null,
      twitchAccessToken: null,
      twitchRefreshToken: null,
      rememberedSession: false,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async verifyUserEmail(id: number): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, emailVerified: true };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, role };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...stripeInfo };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async setPasswordResetToken(email: string): Promise<{ token: string, expires: Date } | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;
    
    // Token expires in 1 hour
    const expires = new Date();
    expires.setHours(expires.getHours() + 1);
    
    // Generate token
    const token = randomBytes(32).toString('hex');
    
    const updatedUser = { 
      ...user, 
      passwordResetToken: token,
      passwordResetExpires: expires
    };
    
    this.users.set(user.id, updatedUser);
    
    return { token, expires };
  }
  
  async resetPassword(token: string, newPassword: string): Promise<User | undefined> {
    const user = await this.getUserByPasswordResetToken(token);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      password: newPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    };
    
    this.users.set(user.id, updatedUser);
    
    return updatedUser;
  }
  
  async createOrUpdateTwitchUser(twitchData: { twitchId: string, username: string, email: string, accessToken: string, refreshToken: string }): Promise<User> {
    // Check if user already exists with this Twitch ID
    let user = await this.getUserByTwitchId(twitchData.twitchId);
    
    if (user) {
      // Update existing user
      const updatedUser = { 
        ...user, 
        twitchAccessToken: twitchData.accessToken,
        twitchRefreshToken: twitchData.refreshToken
      };
      
      this.users.set(user.id, updatedUser);
      return updatedUser;
    } else {
      // Check if user exists with this email
      user = await this.getUserByEmail(twitchData.email);
      
      if (user) {
        // Link Twitch account to existing user
        const updatedUser = { 
          ...user, 
          twitchId: twitchData.twitchId,
          twitchAccessToken: twitchData.accessToken,
          twitchRefreshToken: twitchData.refreshToken,
          emailVerified: true // Twitch verified their email
        };
        
        this.users.set(user.id, updatedUser);
        return updatedUser;
      } else {
        // Create new user from Twitch data
        const id = this.currentUserId++;
        // Generate a random password (they'll need to reset it if they want to login without Twitch)
        const password = randomBytes(16).toString('hex');
        
        const newUser: User = {
          id,
          username: twitchData.username,
          email: twitchData.email,
          password,
          role: "user",
          emailVerified: true, // Twitch verified their email
          twitchId: twitchData.twitchId,
          twitchAccessToken: twitchData.accessToken,
          twitchRefreshToken: twitchData.refreshToken,
          stripeCustomerId: null,
          stripeSubscriptionId: null,
          passwordResetToken: null,
          passwordResetExpires: null,
          rememberedSession: false,
          createdAt: new Date()
        };
        
        this.users.set(id, newUser);
        return newUser;
      }
    }
  }
  
  async updateRememberedSession(id: number, remembered: boolean): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, rememberedSession: remembered };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = this.currentPackageId++;
    const pkg: Package = { ...insertPackage, id };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: number, packageUpdate: Partial<InsertPackage>): Promise<Package | undefined> {
    const pkg = this.packages.get(id);
    if (!pkg) return undefined;
    
    const updatedPackage = { ...pkg, ...packageUpdate };
    this.packages.set(id, updatedPackage);
    return updatedPackage;
  }

  async deletePackage(id: number): Promise<boolean> {
    return this.packages.delete(id);
  }

  // SEO Settings operations
  async getSeoSettings(pageSlug: string): Promise<SeoSettings | undefined> {
    return Array.from(this.seoSettings.values()).find(
      (settings) => settings.pageSlug === pageSlug
    );
  }

  async getAllSeoSettings(): Promise<SeoSettings[]> {
    return Array.from(this.seoSettings.values());
  }

  async createSeoSettings(insertSettings: InsertSeoSettings): Promise<SeoSettings> {
    const id = this.currentSeoSettingsId++;
    const settings: SeoSettings = { ...insertSettings, id };
    this.seoSettings.set(id, settings);
    return settings;
  }

  async updateSeoSettings(id: number, settingsUpdate: Partial<InsertSeoSettings>): Promise<SeoSettings | undefined> {
    const settings = this.seoSettings.get(id);
    if (!settings) return undefined;
    
    const updatedSettings = { ...settings, ...settingsUpdate };
    this.seoSettings.set(id, updatedSettings);
    return updatedSettings;
  }
  
  // Statistics operations
  async getStatistics(): Promise<Statistic[]> {
    return Array.from(this.statistics.values());
  }
  
  async getActiveStatistics(): Promise<Statistic[]> {
    return Array.from(this.statistics.values()).filter(stat => stat.isActive);
  }
  
  async getStatistic(id: number): Promise<Statistic | undefined> {
    return this.statistics.get(id);
  }
  
  async createStatistic(statistic: InsertStatistic): Promise<Statistic> {
    const id = this.currentStatisticId++;
    const newStatistic: Statistic = { ...statistic, id };
    this.statistics.set(id, newStatistic);
    return newStatistic;
  }
  
  async updateStatistic(id: number, update: Partial<InsertStatistic>): Promise<Statistic | undefined> {
    const statistic = this.statistics.get(id);
    if (!statistic) return undefined;
    
    const updatedStatistic = { ...statistic, ...update };
    this.statistics.set(id, updatedStatistic);
    return updatedStatistic;
  }
  
  async deleteStatistic(id: number): Promise<boolean> {
    return this.statistics.delete(id);
  }
  
  // Success Stories operations
  async getSuccessStories(): Promise<SuccessStory[]> {
    return Array.from(this.successStories.values());
  }
  
  async getVisibleSuccessStories(): Promise<SuccessStory[]> {
    return Array.from(this.successStories.values()).filter(story => story.isVisible);
  }
  
  async getSuccessStory(id: number): Promise<SuccessStory | undefined> {
    return this.successStories.get(id);
  }
  
  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    const id = this.currentSuccessStoryId++;
    const newStory: SuccessStory = { ...story, id };
    this.successStories.set(id, newStory);
    return newStory;
  }
  
  async updateSuccessStory(id: number, update: Partial<InsertSuccessStory>): Promise<SuccessStory | undefined> {
    const story = this.successStories.get(id);
    if (!story) return undefined;
    
    const updatedStory = { ...story, ...update };
    this.successStories.set(id, updatedStory);
    return updatedStory;
  }
  
  async deleteSuccessStory(id: number): Promise<boolean> {
    return this.successStories.delete(id);
  }
  
  // FAQ operations
  async getFaqCategories(): Promise<FaqCategory[]> {
    return Array.from(this.faqCategories.values());
  }
  
  async getFaqCategory(id: number): Promise<FaqCategory | undefined> {
    return this.faqCategories.get(id);
  }
  
  async createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory> {
    const id = this.currentFaqCategoryId++;
    const newCategory: FaqCategory = { ...category, id };
    this.faqCategories.set(id, newCategory);
    return newCategory;
  }
  
  async updateFaqCategory(id: number, update: Partial<InsertFaqCategory>): Promise<FaqCategory | undefined> {
    const category = this.faqCategories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...update };
    this.faqCategories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteFaqCategory(id: number): Promise<boolean> {
    // Also delete all items in this category
    Array.from(this.faqItems.values())
      .filter(item => item.categoryId === id)
      .forEach(item => this.faqItems.delete(item.id));
      
    return this.faqCategories.delete(id);
  }
  
  async getFaqItems(): Promise<FaqItem[]> {
    return Array.from(this.faqItems.values());
  }
  
  async getFaqItemsByCategory(categoryId: number): Promise<FaqItem[]> {
    return Array.from(this.faqItems.values())
      .filter(item => item.categoryId === categoryId)
      .sort((a, b) => a.order - b.order);
  }
  
  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    return this.faqItems.get(id);
  }
  
  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const id = this.currentFaqItemId++;
    const newItem: FaqItem = { ...item, id };
    this.faqItems.set(id, newItem);
    return newItem;
  }
  
  async updateFaqItem(id: number, update: Partial<InsertFaqItem>): Promise<FaqItem | undefined> {
    const item = this.faqItems.get(id);
    if (!item) return undefined;
    
    const updatedItem = { ...item, ...update };
    this.faqItems.set(id, updatedItem);
    return updatedItem;
  }
  
  async deleteFaqItem(id: number): Promise<boolean> {
    return this.faqItems.delete(id);
  }
  
  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }
  
  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.isPublished);
  }
  
  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values())
      .find(post => post.slug === slug);
  }
  
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }
  
  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.currentBlogPostId++;
    const newPost: BlogPost = { ...post, id };
    this.blogPosts.set(id, newPost);
    return newPost;
  }
  
  async updateBlogPost(id: number, update: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;
    
    const updatedPost = { ...post, ...update };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }
  
  // Security Badges operations
  async getSecurityBadges(): Promise<SecurityBadge[]> {
    return Array.from(this.securityBadges.values());
  }
  
  async getActiveSecurityBadges(): Promise<SecurityBadge[]> {
    return Array.from(this.securityBadges.values())
      .filter(badge => badge.isActive);
  }
  
  async getSecurityBadge(id: number): Promise<SecurityBadge | undefined> {
    return this.securityBadges.get(id);
  }
  
  async createSecurityBadge(badge: InsertSecurityBadge): Promise<SecurityBadge> {
    const id = this.currentSecurityBadgeId++;
    const newBadge: SecurityBadge = { ...badge, id };
    this.securityBadges.set(id, newBadge);
    return newBadge;
  }
  
  async updateSecurityBadge(id: number, update: Partial<InsertSecurityBadge>): Promise<SecurityBadge | undefined> {
    const badge = this.securityBadges.get(id);
    if (!badge) return undefined;
    
    const updatedBadge = { ...badge, ...update };
    this.securityBadges.set(id, updatedBadge);
    return updatedBadge;
  }
  
  async deleteSecurityBadge(id: number): Promise<boolean> {
    return this.securityBadges.delete(id);
  }
  
  // Limited Time Offers operations
  async getLimitedTimeOffers(): Promise<LimitedTimeOffer[]> {
    return Array.from(this.limitedTimeOffers.values());
  }
  
  async getActiveLimitedTimeOffers(): Promise<LimitedTimeOffer[]> {
    const now = new Date();
    return Array.from(this.limitedTimeOffers.values())
      .filter(offer => offer.isActive && 
        new Date(offer.startDate) <= now && 
        new Date(offer.endDate) >= now);
  }
  
  async getLimitedTimeOffer(id: number): Promise<LimitedTimeOffer | undefined> {
    return this.limitedTimeOffers.get(id);
  }
  
  async createLimitedTimeOffer(offer: InsertLimitedTimeOffer): Promise<LimitedTimeOffer> {
    const id = this.currentLimitedTimeOfferId++;
    const newOffer: LimitedTimeOffer = { ...offer, id };
    this.limitedTimeOffers.set(id, newOffer);
    return newOffer;
  }
  
  async updateLimitedTimeOffer(id: number, update: Partial<InsertLimitedTimeOffer>): Promise<LimitedTimeOffer | undefined> {
    const offer = this.limitedTimeOffers.get(id);
    if (!offer) return undefined;
    
    const updatedOffer = { ...offer, ...update };
    this.limitedTimeOffers.set(id, updatedOffer);
    return updatedOffer;
  }
  
  async deleteLimitedTimeOffer(id: number): Promise<boolean> {
    return this.limitedTimeOffers.delete(id);
  }
  
  // Media Files operations
  async getMediaFiles(): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values());
  }
  
  async getMediaFilesByUser(userId: number): Promise<MediaFile[]> {
    return Array.from(this.mediaFiles.values()).filter(
      (file) => file.userId === userId
    );
  }
  
  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    return this.mediaFiles.get(id);
  }
  
  async createMediaFile(file: InsertMediaFile): Promise<MediaFile> {
    const id = this.currentMediaFileId++;
    const now = new Date();
    
    const mediaFile: MediaFile = {
      ...file,
      id,
      uploadedAt: now
    };
    
    this.mediaFiles.set(id, mediaFile);
    return mediaFile;
  }
  
  async deleteMediaFile(id: number): Promise<boolean> {
    const exists = this.mediaFiles.has(id);
    if (exists) {
      this.mediaFiles.delete(id);
    }
    return exists;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async getUserByTwitchId(twitchId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.twitchId, twitchId)).limit(1);
    return result[0];
  }

  async getUserByPasswordResetToken(token: string): Promise<User | undefined> {
    const now = new Date();
    const result = await db.select().from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          gte(users.passwordResetExpires, now)
        )
      )
      .limit(1);
    return result[0];
  }
  
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return result[0];
  }

  async verifyUserEmail(id: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async updateUserRole(id: number, role: string): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({
        stripeCustomerId: stripeInfo.stripeCustomerId,
        stripeSubscriptionId: stripeInfo.stripeSubscriptionId
      })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async setPasswordResetToken(email: string): Promise<{ token: string, expires: Date } | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    await db
      .update(users)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expires
      })
      .where(eq(users.id, user.id));

    return { token, expires };
  }

  async resetPassword(token: string, newPassword: string): Promise<User | undefined> {
    const user = await this.getUserByPasswordResetToken(token);
    if (!user) return undefined;

    const result = await db
      .update(users)
      .set({
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      })
      .where(eq(users.id, user.id))
      .returning();

    return result[0];
  }

  async createOrUpdateTwitchUser(twitchData: { twitchId: string, username: string, email: string, accessToken: string, refreshToken: string }): Promise<User> {
    const existingUser = await this.getUserByTwitchId(twitchData.twitchId);

    if (existingUser) {
      const result = await db
        .update(users)
        .set({
          twitchAccessToken: twitchData.accessToken,
          twitchRefreshToken: twitchData.refreshToken
        })
        .where(eq(users.id, existingUser.id))
        .returning();
      return result[0];
    } else {
      // Check if user exists with the same email
      const userByEmail = await this.getUserByEmail(twitchData.email);
      
      if (userByEmail) {
        // Update existing user with Twitch information
        const result = await db
          .update(users)
          .set({
            twitchId: twitchData.twitchId,
            twitchAccessToken: twitchData.accessToken,
            twitchRefreshToken: twitchData.refreshToken
          })
          .where(eq(users.id, userByEmail.id))
          .returning();
        return result[0];
      } else {
        // Create a new user with Twitch information
        const randomPassword = randomBytes(16).toString('hex');
        const newUser = await this.createUser({
          username: twitchData.username,
          email: twitchData.email,
          password: randomPassword,
          twitchId: twitchData.twitchId,
          twitchAccessToken: twitchData.accessToken,
          twitchRefreshToken: twitchData.refreshToken,
          emailVerified: true // Auto-verify users who sign in with Twitch
        });
        return newUser;
      }
    }
  }

  async updateRememberedSession(id: number, remembered: boolean): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ rememberedSession: remembered })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  // Package operations
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages).orderBy(packages.price);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const result = await db.select().from(packages).where(eq(packages.id, id)).limit(1);
    return result[0];
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const result = await db.insert(packages).values(pkg).returning();
    return result[0];
  }

  async updatePackage(id: number, pkg: Partial<InsertPackage>): Promise<Package | undefined> {
    const result = await db.update(packages).set(pkg).where(eq(packages.id, id)).returning();
    return result[0];
  }

  async deletePackage(id: number): Promise<boolean> {
    const result = await db.delete(packages).where(eq(packages.id, id));
    return result.count > 0;
  }

  // SEO Settings operations
  async getSeoSettings(pageSlug: string): Promise<SeoSettings | undefined> {
    const result = await db.select().from(seoSettings).where(eq(seoSettings.pageSlug, pageSlug)).limit(1);
    return result[0];
  }

  async getAllSeoSettings(): Promise<SeoSettings[]> {
    return await db.select().from(seoSettings);
  }

  async createSeoSettings(settings: InsertSeoSettings): Promise<SeoSettings> {
    const result = await db.insert(seoSettings).values(settings).returning();
    return result[0];
  }

  async updateSeoSettings(id: number, settings: Partial<InsertSeoSettings>): Promise<SeoSettings | undefined> {
    const result = await db.update(seoSettings).set(settings).where(eq(seoSettings.id, id)).returning();
    return result[0];
  }

  // Statistics operations
  async getStatistics(): Promise<Statistic[]> {
    return await db.select().from(statistics).orderBy(statistics.order);
  }

  async getActiveStatistics(): Promise<Statistic[]> {
    return await db.select().from(statistics).where(eq(statistics.isActive, true)).orderBy(statistics.order);
  }

  async getStatistic(id: number): Promise<Statistic | undefined> {
    const result = await db.select().from(statistics).where(eq(statistics.id, id)).limit(1);
    return result[0];
  }

  async createStatistic(statistic: InsertStatistic): Promise<Statistic> {
    const result = await db.insert(statistics).values(statistic).returning();
    return result[0];
  }

  async updateStatistic(id: number, statistic: Partial<InsertStatistic>): Promise<Statistic | undefined> {
    const result = await db.update(statistics).set(statistic).where(eq(statistics.id, id)).returning();
    return result[0];
  }

  async deleteStatistic(id: number): Promise<boolean> {
    const result = await db.delete(statistics).where(eq(statistics.id, id));
    return result.count > 0;
  }

  // Success Stories operations
  async getSuccessStories(): Promise<SuccessStory[]> {
    return await db.select().from(successStories).orderBy(successStories.order);
  }

  async getVisibleSuccessStories(): Promise<SuccessStory[]> {
    return await db.select().from(successStories).where(eq(successStories.isVisible, true)).orderBy(successStories.order);
  }

  async getSuccessStory(id: number): Promise<SuccessStory | undefined> {
    const result = await db.select().from(successStories).where(eq(successStories.id, id)).limit(1);
    return result[0];
  }

  async createSuccessStory(story: InsertSuccessStory): Promise<SuccessStory> {
    const result = await db.insert(successStories).values(story).returning();
    return result[0];
  }

  async updateSuccessStory(id: number, story: Partial<InsertSuccessStory>): Promise<SuccessStory | undefined> {
    const result = await db.update(successStories).set(story).where(eq(successStories.id, id)).returning();
    return result[0];
  }

  async deleteSuccessStory(id: number): Promise<boolean> {
    const result = await db.delete(successStories).where(eq(successStories.id, id));
    return result.count > 0;
  }

  // FAQ operations
  async getFaqCategories(): Promise<FaqCategory[]> {
    return await db.select().from(faqCategories).orderBy(faqCategories.order);
  }

  async getFaqCategory(id: number): Promise<FaqCategory | undefined> {
    const result = await db.select().from(faqCategories).where(eq(faqCategories.id, id)).limit(1);
    return result[0];
  }

  async createFaqCategory(category: InsertFaqCategory): Promise<FaqCategory> {
    const result = await db.insert(faqCategories).values(category).returning();
    return result[0];
  }

  async updateFaqCategory(id: number, category: Partial<InsertFaqCategory>): Promise<FaqCategory | undefined> {
    const result = await db.update(faqCategories).set(category).where(eq(faqCategories.id, id)).returning();
    return result[0];
  }

  async deleteFaqCategory(id: number): Promise<boolean> {
    const result = await db.delete(faqCategories).where(eq(faqCategories.id, id));
    return result.count > 0;
  }

  async getFaqItems(): Promise<FaqItem[]> {
    return await db.select().from(faqItems).orderBy(faqItems.order);
  }

  async getFaqItemsByCategory(categoryId: number): Promise<FaqItem[]> {
    return await db.select().from(faqItems).where(eq(faqItems.categoryId, categoryId)).orderBy(faqItems.order);
  }

  async getFaqItem(id: number): Promise<FaqItem | undefined> {
    const result = await db.select().from(faqItems).where(eq(faqItems.id, id)).limit(1);
    return result[0];
  }

  async createFaqItem(item: InsertFaqItem): Promise<FaqItem> {
    const result = await db.insert(faqItems).values(item).returning();
    return result[0];
  }

  async updateFaqItem(id: number, item: Partial<InsertFaqItem>): Promise<FaqItem | undefined> {
    const result = await db.update(faqItems).set(item).where(eq(faqItems.id, id)).returning();
    return result[0];
  }

  async deleteFaqItem(id: number): Promise<boolean> {
    const result = await db.delete(faqItems).where(eq(faqItems.id, id));
    return result.count > 0;
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.publishDate, 'desc');
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    const now = new Date();
    return await db.select().from(blogPosts)
      .where(
        and(
          eq(blogPosts.isPublished, true),
          lt(blogPosts.publishDate, now)
        )
      )
      .orderBy(blogPosts.publishDate, 'desc');
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
    return result[0];
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.count > 0;
  }

  // Security Badges operations
  async getSecurityBadges(): Promise<SecurityBadge[]> {
    return await db.select().from(securityBadges).orderBy(securityBadges.order);
  }

  async getActiveSecurityBadges(): Promise<SecurityBadge[]> {
    return await db.select().from(securityBadges).where(eq(securityBadges.isActive, true)).orderBy(securityBadges.order);
  }

  async getSecurityBadge(id: number): Promise<SecurityBadge | undefined> {
    const result = await db.select().from(securityBadges).where(eq(securityBadges.id, id)).limit(1);
    return result[0];
  }

  async createSecurityBadge(badge: InsertSecurityBadge): Promise<SecurityBadge> {
    const result = await db.insert(securityBadges).values(badge).returning();
    return result[0];
  }

  async updateSecurityBadge(id: number, badge: Partial<InsertSecurityBadge>): Promise<SecurityBadge | undefined> {
    const result = await db.update(securityBadges).set(badge).where(eq(securityBadges.id, id)).returning();
    return result[0];
  }

  async deleteSecurityBadge(id: number): Promise<boolean> {
    const result = await db.delete(securityBadges).where(eq(securityBadges.id, id));
    return result.count > 0;
  }

  // Limited Time Offers operations
  async getLimitedTimeOffers(): Promise<LimitedTimeOffer[]> {
    return await db.select().from(limitedTimeOffers);
  }

  async getActiveLimitedTimeOffers(): Promise<LimitedTimeOffer[]> {
    const now = new Date();
    return await db.select().from(limitedTimeOffers)
      .where(
        and(
          eq(limitedTimeOffers.isActive, true),
          lt(limitedTimeOffers.startDate, now),
          gte(limitedTimeOffers.endDate, now)
        )
      );
  }

  async getLimitedTimeOffer(id: number): Promise<LimitedTimeOffer | undefined> {
    const result = await db.select().from(limitedTimeOffers).where(eq(limitedTimeOffers.id, id)).limit(1);
    return result[0];
  }

  async createLimitedTimeOffer(offer: InsertLimitedTimeOffer): Promise<LimitedTimeOffer> {
    const result = await db.insert(limitedTimeOffers).values(offer).returning();
    return result[0];
  }

  async updateLimitedTimeOffer(id: number, offer: Partial<InsertLimitedTimeOffer>): Promise<LimitedTimeOffer | undefined> {
    const result = await db.update(limitedTimeOffers).set(offer).where(eq(limitedTimeOffers.id, id)).returning();
    return result[0];
  }

  async deleteLimitedTimeOffer(id: number): Promise<boolean> {
    const result = await db.delete(limitedTimeOffers).where(eq(limitedTimeOffers.id, id));
    return result.count > 0;
  }
  
  // Media Files operations
  async getMediaFiles(): Promise<MediaFile[]> {
    return await db.select().from(mediaFiles).orderBy(mediaFiles.uploadedAt, 'desc');
  }
  
  async getMediaFilesByUser(userId: number): Promise<MediaFile[]> {
    return await db.select().from(mediaFiles).where(eq(mediaFiles.userId, userId)).orderBy(mediaFiles.uploadedAt, 'desc');
  }
  
  async getMediaFile(id: number): Promise<MediaFile | undefined> {
    const result = await db.select().from(mediaFiles).where(eq(mediaFiles.id, id)).limit(1);
    return result[0];
  }
  
  async createMediaFile(file: InsertMediaFile): Promise<MediaFile> {
    const result = await db.insert(mediaFiles).values(file).returning();
    return result[0];
  }
  
  async deleteMediaFile(id: number): Promise<boolean> {
    const result = await db.delete(mediaFiles).where(eq(mediaFiles.id, id));
    return result.count > 0;
  }
}

// Use DatabaseStorage for persistence
export const storage = new DatabaseStorage();
