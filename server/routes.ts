import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

// Önbelleğe alma için basit bir mekanizma
interface CacheEntry {
  data: any;
  expires: number;
}

const cache = new Map<string, CacheEntry>();

// Önbelleğe alma middleware'i
function cacheMiddleware(ttl = 60000) { // Varsayılan olarak 1 dakika
  return (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    // Sadece GET istekleri için önbelleğe alın
    if (req.method !== 'GET') {
      return next();
    }
    
    // Kullanıcıya özel içerik için önbelleğe almayın
    if (req.isAuthenticated()) {
      return next();
    }

    const key = req.originalUrl;
    const cachedResponse = cache.get(key);
    
    if (cachedResponse && cachedResponse.expires > Date.now()) {
      // Önbellekten yanıt verin
      return res.json(cachedResponse.data);
    }
    
    // Orijinal json metodunu yakala
    const originalJson = res.json;
    res.json = function(body) {
      // Yanıtı önbelleğe al
      cache.set(key, {
        data: body,
        expires: Date.now() + ttl
      });
      
      // Orijinal yanıtı döndür
      return originalJson.call(this, body);
    };
    
    next();
  };
};

function checkIsAdmin(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  const user = req.user as SelectUser;
  if (user.role !== 'admin') {
    return res.status(403).json({ message: "Not authorized" });
  }
  
  next();
}

function checkIsVerified(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  const user = req.user as SelectUser;
  if (!user.emailVerified) {
    return res.status(403).json({ message: "Email not verified" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up auth routes
  setupAuth(app);

  // Initialize Stripe with fallback
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_dummy";
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
  });

  // ----- User Routes -----
  
  // Check if user has subscription
  app.get("/api/subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as SelectUser;
    
    if (!user.stripeSubscriptionId) {
      return res.json({ hasSubscription: false });
    }
    
    try {
      // In a real app, we would check the subscription status with Stripe
      // For now, we'll just return that they have a subscription if the ID exists
      res.json({ 
        hasSubscription: true, 
        subscriptionId: user.stripeSubscriptionId 
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error checking subscription: " + error.message });
    }
  });

  // ----- Package Routes -----
  
  // Get all packages
  app.get("/api/packages", async (req, res) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching packages: " + error.message });
    }
  });
  
  // Get a single package
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const pkg = await storage.getPackage(packageId);
      
      if (!pkg) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(pkg);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching package: " + error.message });
    }
  });
  
  // Create a package (admin only)
  app.post("/api/packages", checkIsAdmin, async (req, res) => {
    try {
      const newPackage = await storage.createPackage(req.body);
      res.status(201).json(newPackage);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating package: " + error.message });
    }
  });
  
  // Update a package (admin only)
  app.patch("/api/packages/:id", checkIsAdmin, async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const updatedPackage = await storage.updatePackage(packageId, req.body);
      
      if (!updatedPackage) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.json(updatedPackage);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating package: " + error.message });
    }
  });
  
  // Delete a package (admin only)
  app.delete("/api/packages/:id", checkIsAdmin, async (req, res) => {
    try {
      const packageId = parseInt(req.params.id);
      const deleted = await storage.deletePackage(packageId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Package not found" });
      }
      
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting package: " + error.message });
    }
  });

  // ----- SEO Settings Routes -----
  
  // Get SEO settings for a page
  app.get("/api/seo/:pageSlug", async (req, res) => {
    try {
      const pageSlug = req.params.pageSlug;
      const seoSettings = await storage.getSeoSettings(pageSlug);
      
      if (!seoSettings) {
        return res.status(404).json({ message: "SEO settings not found" });
      }
      
      res.json(seoSettings);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching SEO settings: " + error.message });
    }
  });
  
  // Get all SEO settings (admin only)
  app.get("/api/seo", checkIsAdmin, async (req, res) => {
    try {
      const allSettings = await storage.getAllSeoSettings();
      res.json(allSettings);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching SEO settings: " + error.message });
    }
  });
  
  // Create SEO settings for a page (admin only)
  app.post("/api/seo", checkIsAdmin, async (req, res) => {
    try {
      const newSettings = await storage.createSeoSettings(req.body);
      res.status(201).json(newSettings);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating SEO settings: " + error.message });
    }
  });
  
  // Update SEO settings for a page (admin only)
  app.patch("/api/seo/:id", checkIsAdmin, async (req, res) => {
    try {
      const settingsId = parseInt(req.params.id);
      const updatedSettings = await storage.updateSeoSettings(settingsId, req.body);
      
      if (!updatedSettings) {
        return res.status(404).json({ message: "SEO settings not found" });
      }
      
      res.json(updatedSettings);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating SEO settings: " + error.message });
    }
  });

  // ----- Stripe Integration -----
  
  // Checkout session for subscription
  app.post("/api/create-checkout-session", checkIsVerified, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const { priceId } = req.body;
      const user = req.user as SelectUser;
      
      // Check if Stripe is properly set up
      if (process.env.STRIPE_SECRET_KEY?.startsWith('sk_')) {
        // Create or retrieve a Stripe customer
        let stripeCustomerId = user.stripeCustomerId;
        
        if (!stripeCustomerId) {
          // Create a new customer in Stripe
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.username,
            metadata: {
              userId: user.id.toString()
            }
          });
          
          stripeCustomerId = customer.id;
          
          // Update the user with the new Stripe customer ID
          await storage.updateUserStripeInfo(user.id, {
            stripeCustomerId,
            stripeSubscriptionId: user.stripeSubscriptionId || null
          });
        }
        
        // In a real production app, you would create a Stripe Checkout session
        // For this demo, we'll create a subscription directly
        
        const stripeSubscriptionId = `sub_${Date.now()}`;
        
        // Update user with stripe subscription information
        await storage.updateUserStripeInfo(user.id, {
          stripeCustomerId,
          stripeSubscriptionId
        });
        
        res.json({
          success: true,
          message: "Subscription created successfully",
          subscriptionId: stripeSubscriptionId
        });
      } else {
        // For development without Stripe keys, use the mock approach
        const stripeCustomerId = `cus_mock_${Date.now()}`;
        const stripeSubscriptionId = `sub_mock_${Date.now()}`;
        
        // Update user with stripe information
        await storage.updateUserStripeInfo(user.id, {
          stripeCustomerId,
          stripeSubscriptionId
        });
        
        res.json({
          success: true,
          message: "Mock subscription created successfully",
          subscriptionId: stripeSubscriptionId
        });
      }
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Error creating checkout session: " + error.message });
    }
  });

  // Metrics API endpoint for Web Vitals
  app.post("/api/metrics", (req, res) => {
    // Gerçek bir uygulamada bu verileri bir analitik sistemine kaydedersiniz
    // Şimdilik sadece logluyoruz
    if (process.env.NODE_ENV !== 'production') {
      console.log('Web Vitals Metrics:', req.body);
    }
    res.status(200).send('ok');
  });

  // Generate XML sitemap
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const seoSettings = await storage.getAllSeoSettings();
      const baseUrl = req.protocol + '://' + req.get('host');
      
      // Create XML content
      let xml = '<?xml version="1.0" encoding="UTF-8"?>';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
      
      // Add homepage
      xml += `
        <url>
          <loc>${baseUrl}/</loc>
          <priority>1.0</priority>
          <changefreq>weekly</changefreq>
        </url>
      `;
      
      // Add other pages from SEO settings
      seoSettings.forEach(setting => {
        if (setting.pageSlug !== 'home') {
          xml += `
            <url>
              <loc>${baseUrl}/${setting.pageSlug}</loc>
              <priority>${setting.cornerstoneContent ? '0.8' : '0.6'}</priority>
              <changefreq>weekly</changefreq>
            </url>
          `;
        }
      });
      
      xml += '</urlset>';
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error: any) {
      res.status(500).json({ message: "Error generating sitemap: " + error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
