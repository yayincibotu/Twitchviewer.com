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
  limitedTimeOffers, type LimitedTimeOffer, type InsertLimitedTimeOffer
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUserEmail(id: number): Promise<User | undefined>;
  updateUserRole(id: number, role: string): Promise<User | undefined>;
  updateUserStripeInfo(id: number, stripeInfo: { stripeCustomerId: string, stripeSubscriptionId: string }): Promise<User | undefined>;
  
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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private seoSettings: Map<number, SeoSettings>;
  private statistics: Map<number, Statistic>;
  private successStories: Map<number, SuccessStory>;
  private faqCategories: Map<number, FaqCategory>;
  private faqItems: Map<number, FaqItem>;
  private blogPosts: Map<number, BlogPost>;
  private securityBadges: Map<number, SecurityBadge>;
  private limitedTimeOffers: Map<number, LimitedTimeOffer>;
  
  sessionStore: session.SessionStore;
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

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      emailVerified: false, 
      role: "user",
      stripeCustomerId: null,
      stripeSubscriptionId: null
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
}

export const storage = new MemStorage();
