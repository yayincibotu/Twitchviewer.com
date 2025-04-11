import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import PricingSection from "@/components/sections/pricing-section";
import ContactSection from "@/components/sections/contact-section";
import CtaSection from "@/components/sections/cta-section";
import { useAuth } from "@/hooks/use-auth";

// Yeni bileşenleri içe aktar
import StatisticsSection from "@/components/sections/statistics-section";
import SuccessStoriesSection from "@/components/sections/success-stories-section";
import EnhancedFaqSection from "@/components/sections/enhanced-faq-section";
import LimitedTimeOfferBanner from "@/components/sections/limited-time-offer-banner";
import SecurityBadgesSection from "@/components/sections/security-badges-section";
import BlogPreviewSection from "@/components/sections/blog-preview-section";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  // Fetch SEO settings for the homepage
  const { data: seoSettings } = useQuery({
    queryKey: ['/api/seo/home'],
  });
  
  // If logged in and email verified, show dashboard button in header
  useEffect(() => {
    // This could be used for any home page specific effects
  }, []);

  return (
    <>
      <Helmet>
        <title>{seoSettings?.title || "TwitchViewer.com - Boost Your Twitch Channel with Real Viewers"}</title>
        <meta name="description" content={seoSettings?.description || "Grow your channel naturally using our automated Twitch viewer system. Boost your Twitch presence with our reliable viewer service."} />
        <meta name="keywords" content={seoSettings?.focusKeyword || "twitch viewers, twitch growth, boost twitch channel"} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <link rel="canonical" href="https://twitchviewer.com/" />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={seoSettings?.title || "TwitchViewer.com - Boost Your Twitch Channel with Real Viewers"} />
        <meta property="og:description" content={seoSettings?.description || "Grow your channel naturally using our automated Twitch viewer system."} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://twitchviewer.com/" />
        <meta property="og:image" content="https://twitchviewer.com/og-image.jpg" />
        
        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoSettings?.title || "TwitchViewer.com - Boost Your Twitch Channel"} />
        <meta name="twitter:description" content={seoSettings?.description || "Grow your Twitch channel naturally with our viewer service."} />
        <meta name="twitter:image" content="https://twitchviewer.com/twitter-card.jpg" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-800">
        {/* Sınırlı süreli teklifler banner'ı */}
        <LimitedTimeOfferBanner />
        
        <Navbar />
        
        <main className="flex-grow">
          <HeroSection 
            onGetStarted={() => {
              if (user) {
                setLocation("/dashboard");
              } else {
                setLocation("/auth");
              }
            }}
          />
          
          {/* Canlı istatistikler bölümü */}
          <StatisticsSection />
          
          <FeaturesSection />
          
          {/* Güvenlik rozetleri */}
          <SecurityBadgesSection />
          
          {/* Başarı hikayeleri */}
          <SuccessStoriesSection />
          
          <PricingSection />
          
          {/* Blog önizleme */}
          <BlogPreviewSection />
          
          {/* Gelişmiş SSS bölümü */}
          <EnhancedFaqSection />
          
          <ContactSection />
          
          <CtaSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
