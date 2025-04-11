import { Express } from "express";
import { storage } from "../storage";
import { defaultFollowBotSeo } from "../../shared/data/seo";

export function registerFollowBotRoutes(app: Express) {
  // Get SEO settings for follow bot page
  app.get("/api/seo/follow-bot", async (req, res) => {
    try {
      const seoSettings = await storage.getSeoSettings("follow-bot");
      if (!seoSettings) {
        return res.status(404).json(defaultFollowBotSeo);
      }
      return res.json(seoSettings);
    } catch (error) {
      console.error("Error fetching follow bot SEO settings:", error);
      return res.status(500).json({ message: "Failed to fetch SEO settings" });
    }
  });

  // More API routes for follow bot functionality would go here
  // For example: follow bot analytics, statistics, etc.
}