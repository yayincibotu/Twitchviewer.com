import { users, type User, type InsertUser, packages, type Package, type InsertPackage, seoSettings, type SeoSettings, type InsertSeoSettings } from "@shared/schema";
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
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private packages: Map<number, Package>;
  private seoSettings: Map<number, SeoSettings>;
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentPackageId: number;
  currentSeoSettingsId: number;

  constructor() {
    this.users = new Map();
    this.packages = new Map();
    this.seoSettings = new Map();
    this.currentUserId = 1;
    this.currentPackageId = 1;
    this.currentSeoSettingsId = 1;
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
}

export const storage = new MemStorage();
