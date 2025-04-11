import { Express } from "express";
import { storage } from "../storage";
import { defaultChatBotSeo } from "../../shared/data/seo";

export function registerChatBotRoutes(app: Express) {
  // Get SEO settings for chat bot page
  app.get("/api/seo/chat-bot", async (req, res) => {
    try {
      const seoSettings = await storage.getSeoSettings("chat-bot");
      if (!seoSettings) {
        return res.status(404).json(defaultChatBotSeo);
      }
      return res.json(seoSettings);
    } catch (error) {
      console.error("Error fetching chat bot SEO settings:", error);
      return res.status(500).json({ message: "Failed to fetch SEO settings" });
    }
  });

  // More API routes for chat bot functionality would go here
  // For example: chatbot commands, templates, etc.
}