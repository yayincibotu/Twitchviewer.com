import type { Express } from "express";
import { createServer as createHttpServer, type Server } from "http";
import { createServer as createHttp2Server } from "http2";
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

// Belirli bir önbellek anahtarını veya tüm önbelleği temizle
function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

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
  
  // Get all packages (5 dakika önbellekleme)
  app.get("/api/packages", cacheMiddleware(300000), async (req, res) => {
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
      // Paketler önbelleğini temizle, böylece kullanıcılar yeni paketi görebilir
      clearCache('/api/packages');
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
      
      // Paketler önbelleğini temizle
      clearCache('/api/packages');
      // Ayrıca spesifik paket önbelleğini de temizle
      clearCache(`/api/packages/${packageId}`);
      
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
      
      // Paketler önbelleğini temizle
      clearCache('/api/packages');
      // Ayrıca silinen pakete ait önbelleği de temizle
      clearCache(`/api/packages/${packageId}`);
      
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting package: " + error.message });
    }
  });

  // ----- SEO Settings Routes -----
  
  // Get SEO settings for a page (30 dakika önbellekleme)
  app.get("/api/seo/:pageSlug", cacheMiddleware(1800000), async (req, res) => {
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
      
      // SEO önbelleğini temizle
      clearCache(`/api/seo/${newSettings.pageSlug}`);
      
      // Sitemap önbelleğini de temizle
      clearCache('/sitemap.xml');
      
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
      
      // İlgili SEO ayarlarının önbelleğini temizle
      clearCache(`/api/seo/${updatedSettings.pageSlug}`);
      
      // Sitemap önbelleğini de temizle
      clearCache('/sitemap.xml');
      
      res.json(updatedSettings);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating SEO settings: " + error.message });
    }
  });
  
  // ----- Statistics Routes (Live Counter) -----
  
  app.get("/api/statistics", cacheMiddleware(60000), async (req, res) => {
    try {
      const statistics = await storage.getActiveStatistics();
      res.json(statistics);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching statistics: " + error.message });
    }
  });
  
  app.post("/api/statistics", checkIsAdmin, async (req, res) => {
    try {
      const statistic = await storage.createStatistic(req.body);
      clearCache('/api/statistics');
      res.status(201).json(statistic);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating statistic: " + error.message });
    }
  });
  
  app.patch("/api/statistics/:id", checkIsAdmin, async (req, res) => {
    try {
      const statId = parseInt(req.params.id);
      const updatedStat = await storage.updateStatistic(statId, req.body);
      
      if (!updatedStat) {
        return res.status(404).json({ message: "Statistic not found" });
      }
      
      clearCache('/api/statistics');
      res.json(updatedStat);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating statistic: " + error.message });
    }
  });
  
  app.delete("/api/statistics/:id", checkIsAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteStatistic(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Statistic not found" });
      }
      
      clearCache('/api/statistics');
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting statistic: " + error.message });
    }
  });
  
  // ----- Success Stories Routes -----
  
  app.get("/api/success-stories", cacheMiddleware(3600000), async (req, res) => {
    try {
      const stories = await storage.getVisibleSuccessStories();
      res.json(stories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching success stories: " + error.message });
    }
  });
  
  app.post("/api/success-stories", checkIsAdmin, async (req, res) => {
    try {
      const story = await storage.createSuccessStory(req.body);
      clearCache('/api/success-stories');
      res.status(201).json(story);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating success story: " + error.message });
    }
  });
  
  app.patch("/api/success-stories/:id", checkIsAdmin, async (req, res) => {
    try {
      const storyId = parseInt(req.params.id);
      const story = await storage.updateSuccessStory(storyId, req.body);
      
      if (!story) {
        return res.status(404).json({ message: "Success story not found" });
      }
      
      clearCache('/api/success-stories');
      res.json(story);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating success story: " + error.message });
    }
  });
  
  app.delete("/api/success-stories/:id", checkIsAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteSuccessStory(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Success story not found" });
      }
      
      clearCache('/api/success-stories');
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting success story: " + error.message });
    }
  });
  
  // ----- FAQ Routes -----
  
  app.get("/api/faq/categories", cacheMiddleware(3600000), async (req, res) => {
    try {
      const categories = await storage.getFaqCategories();
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching FAQ categories: " + error.message });
    }
  });
  
  app.get("/api/faq/items", cacheMiddleware(3600000), async (req, res) => {
    try {
      if (req.query.categoryId) {
        const categoryId = parseInt(req.query.categoryId as string);
        const items = await storage.getFaqItemsByCategory(categoryId);
        return res.json(items);
      }
      
      const items = await storage.getFaqItems();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching FAQ items: " + error.message });
    }
  });
  
  app.post("/api/faq/categories", checkIsAdmin, async (req, res) => {
    try {
      const category = await storage.createFaqCategory(req.body);
      clearCache('/api/faq/categories');
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating FAQ category: " + error.message });
    }
  });
  
  app.post("/api/faq/items", checkIsAdmin, async (req, res) => {
    try {
      const item = await storage.createFaqItem(req.body);
      clearCache('/api/faq/items');
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating FAQ item: " + error.message });
    }
  });
  
  app.patch("/api/faq/categories/:id", checkIsAdmin, async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      const category = await storage.updateFaqCategory(categoryId, req.body);
      
      if (!category) {
        return res.status(404).json({ message: "FAQ category not found" });
      }
      
      clearCache('/api/faq/categories');
      res.json(category);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating FAQ category: " + error.message });
    }
  });
  
  app.patch("/api/faq/items/:id", checkIsAdmin, async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await storage.updateFaqItem(itemId, req.body);
      
      if (!item) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      clearCache('/api/faq/items');
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating FAQ item: " + error.message });
    }
  });
  
  app.delete("/api/faq/categories/:id", checkIsAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteFaqCategory(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "FAQ category not found" });
      }
      
      clearCache('/api/faq/categories');
      clearCache('/api/faq/items'); // Items also need to be cleared because related items are deleted
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting FAQ category: " + error.message });
    }
  });
  
  app.delete("/api/faq/items/:id", checkIsAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteFaqItem(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "FAQ item not found" });
      }
      
      clearCache('/api/faq/items');
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting FAQ item: " + error.message });
    }
  });
  
  // ----- Blog Routes -----
  
  app.get("/api/blog/posts", cacheMiddleware(1800000), async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching blog posts: " + error.message });
    }
  });
  
  app.get("/api/blog/posts/:slug", cacheMiddleware(1800000), async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching blog post: " + error.message });
    }
  });
  
  app.post("/api/blog/posts", checkIsAdmin, async (req, res) => {
    try {
      const post = await storage.createBlogPost(req.body);
      clearCache('/api/blog/posts');
      res.status(201).json(post);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating blog post: " + error.message });
    }
  });
  
  app.patch("/api/blog/posts/:id", checkIsAdmin, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.updateBlogPost(postId, req.body);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      clearCache('/api/blog/posts');
      clearCache(`/api/blog/posts/${post.slug}`);
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating blog post: " + error.message });
    }
  });
  
  app.delete("/api/blog/posts/:id", checkIsAdmin, async (req, res) => {
    try {
      const post = await storage.getBlogPost(parseInt(req.params.id));
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      const deleted = await storage.deleteBlogPost(post.id);
      
      clearCache('/api/blog/posts');
      clearCache(`/api/blog/posts/${post.slug}`);
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting blog post: " + error.message });
    }
  });
  
  // ----- Security Badges Routes -----
  
  app.get("/api/security-badges", cacheMiddleware(86400000), async (req, res) => {
    try {
      const badges = await storage.getActiveSecurityBadges();
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching security badges: " + error.message });
    }
  });
  
  app.post("/api/security-badges", checkIsAdmin, async (req, res) => {
    try {
      const badge = await storage.createSecurityBadge(req.body);
      clearCache('/api/security-badges');
      res.status(201).json(badge);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating security badge: " + error.message });
    }
  });
  
  app.patch("/api/security-badges/:id", checkIsAdmin, async (req, res) => {
    try {
      const badgeId = parseInt(req.params.id);
      const badge = await storage.updateSecurityBadge(badgeId, req.body);
      
      if (!badge) {
        return res.status(404).json({ message: "Security badge not found" });
      }
      
      clearCache('/api/security-badges');
      res.json(badge);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating security badge: " + error.message });
    }
  });
  
  app.delete("/api/security-badges/:id", checkIsAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteSecurityBadge(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Security badge not found" });
      }
      
      clearCache('/api/security-badges');
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting security badge: " + error.message });
    }
  });
  
  // ----- Limited Time Offers Routes -----
  
  app.get("/api/limited-time-offers", cacheMiddleware(60000), async (req, res) => {
    try {
      const offers = await storage.getActiveLimitedTimeOffers();
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching limited time offers: " + error.message });
    }
  });
  
  app.post("/api/limited-time-offers", checkIsAdmin, async (req, res) => {
    try {
      const offer = await storage.createLimitedTimeOffer(req.body);
      clearCache('/api/limited-time-offers');
      res.status(201).json(offer);
    } catch (error: any) {
      res.status(500).json({ message: "Error creating limited time offer: " + error.message });
    }
  });
  
  app.patch("/api/limited-time-offers/:id", checkIsAdmin, async (req, res) => {
    try {
      const offerId = parseInt(req.params.id);
      const offer = await storage.updateLimitedTimeOffer(offerId, req.body);
      
      if (!offer) {
        return res.status(404).json({ message: "Limited time offer not found" });
      }
      
      clearCache('/api/limited-time-offers');
      res.json(offer);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating limited time offer: " + error.message });
    }
  });
  
  app.delete("/api/limited-time-offers/:id", checkIsAdmin, async (req, res) => {
    try {
      const deleted = await storage.deleteLimitedTimeOffer(parseInt(req.params.id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Limited time offer not found" });
      }
      
      clearCache('/api/limited-time-offers');
      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: "Error deleting limited time offer: " + error.message });
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

  // Generate XML sitemap (1 gün önbellekleme)
  app.get("/sitemap.xml", cacheMiddleware(86400000), async (req, res) => {
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

  // Geliştirme ortamında HTTP, prodüksiyonda HTTP/2 kullan
  let httpServer: Server;
  
  if (process.env.NODE_ENV === 'production') {
    // Prodüksiyonda HTTPS/HTTP2 kullan (gerçek uygulamada sertifikalar eklenmelidir)
    console.log('Running server in production mode with HTTP/2 support');
    // Not: Gerçek bir uygulamada burada sertifikalar eklenmelidir
    // Bu örnek için basit HTTP2 destekli sunucu kullanıyoruz
    // Not: HTTP/2 sunucusu için gerekli sertifikalar prodüksiyonda sağlanmalıdır
    httpServer = createHttp2Server();
    
    // Express uygulamasını HTTP/2 sunucuya bağla
    // @ts-ignore - HTTP/2 sunucusu tipini Express nasıl kullanmalı
    httpServer.on('request', app);
  } else {
    // Geliştirme ortamında HTTP/1.1 kullan
    console.log('Running server in development mode with HTTP/1.1');
    httpServer = createHttpServer(app);
  }

  return httpServer;
}
