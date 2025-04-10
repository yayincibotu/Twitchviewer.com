import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/sections/hero-section";
import FeaturesSection from "@/components/sections/features-section";
import PricingSection from "@/components/sections/pricing-section";
import TestimonialsSection from "@/components/sections/testimonials-section";
import ContactSection from "@/components/sections/contact-section";
import FaqSection from "@/components/sections/faq-section";
import CtaSection from "@/components/sections/cta-section";
import { useAuth } from "@/hooks/use-auth";

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
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-800">
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
          <FeaturesSection />
          <PricingSection />
          <TestimonialsSection />
          <ContactSection />
          <FaqSection />
          <CtaSection />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
