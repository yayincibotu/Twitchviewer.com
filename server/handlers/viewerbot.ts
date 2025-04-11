import { Express } from "express";
import { storage } from "../storage";
import { defaultViewerBotSeo } from "../../shared/data/seo";

export function registerViewerBotRoutes(app: Express) {
  // Get SEO settings for viewer bot page
  app.get("/api/seo/viewer-bot", async (req, res) => {
    try {
      const seoSettings = await storage.getSeoSettings("viewer-bot");
      if (!seoSettings) {
        return res.status(404).json(defaultViewerBotSeo);
      }
      return res.json(seoSettings);
    } catch (error) {
      console.error("Error fetching viewer bot SEO settings:", error);
      return res.status(500).json({ message: "Failed to fetch SEO settings" });
    }
  });

  // More API routes for viewer bot functionality would go here
  // For example: activating bots, analytics, etc.
}