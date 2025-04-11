import { db, pool } from '../server/db';
import { users } from '../shared/schema';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  console.log('Creating admin user...');
  
  // Admin kullanıcı bilgileri
  const username = 'exenica';
  const email = 'admin@twitchviewer.com';
  const password = '19891990Can';
  
  try {
    // Mevcut kullanıcıyı kontrol et
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      console.log('Admin user already exists.');
      return;
    }
    
    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);
    
    // Yeni admin kullanıcı oluştur
    const [user] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      emailVerified: true,
      role: 'admin'
    }).returning();
    
    console.log('Admin user created successfully:', {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    // Default SEO settings
    await db.insert(seoSettings).values([
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
    ]);

    // Default packages
    await db.insert(packages).values([
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
    ]);

    console.log('Initial data seeded successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Import additional schema entities
import { seoSettings, packages, statistics, successStories, faqCategories, faqItems, securityBadges, limitedTimeOffers, blogPosts } from '../shared/schema';

// Seed additional default data
async function seedDefaultData() {
  try {
    // Default statistics
    await db.insert(statistics).values([
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
    ]);

    // Default success stories
    await db.insert(successStories).values([
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
    ]);

    // Default security badges
    await db.insert(securityBadges).values([
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
    ]);

    // Default limited time offer
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    await db.insert(limitedTimeOffers).values({
      title: "Launch Special: 30% Off Professional Plan",
      description: "Get our Professional plan with 30% discount for your first 3 months. Limited time offer!",
      discountPercent: 30,
      packageId: 2, // Professional package 
      startDate: now,
      endDate: oneWeekLater,
      couponCode: "LAUNCH30",
      isActive: true
    });

    // Default FAQ categories and items
    const [generalCategory] = await db.insert(faqCategories).values({
      name: "General Questions",
      slug: "general",
      order: 1
    }).returning();
    
    const [technicalCategory] = await db.insert(faqCategories).values({
      name: "Technical Information",
      slug: "technical",
      order: 2
    }).returning();
    
    const [billingCategory] = await db.insert(faqCategories).values({
      name: "Billing & Payments",
      slug: "billing",
      order: 3
    }).returning();

    // Insert FAQ items
    await db.insert(faqItems).values([
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
    ]);

    // Default blog post
    await db.insert(blogPosts).values({
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
    });

    console.log('Additional data seeded successfully');
  } catch (error) {
    console.error('Error seeding additional data:', error);
  }
}

async function main() {
  try {
    await createAdminUser();
    await seedDefaultData();
  } catch (error) {
    console.error('Error in main process:', error);
  } finally {
    // Close the database connection at the very end
    await pool.end();
    console.log('Database connection closed');
  }
}

main();