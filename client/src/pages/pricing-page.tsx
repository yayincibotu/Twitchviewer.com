import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, LimitedTimeOffer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Sparkles, Check, ArrowRight, Shield } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import LimitedTimeOfferBanner from "@/components/sections/limited-time-offer-banner";

export default function PricingPage() {
  const [selectedInterval, setSelectedInterval] = useState<'monthly'|'annually'>('monthly');
  const [activePackage, setActivePackage] = useState<number | null>(null);
  
  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });
  
  const { data: offers = [] } = useQuery<LimitedTimeOffer[]>({
    queryKey: ["/api/limited-time-offers"],
  });

  const [, setLocation] = useLocation();
  
  // Find active offer (if any)
  const activeOffer = offers.find(offer => offer.isActive);
  
  const handleMouseEnter = (id: number) => {
    setActivePackage(id);
  };
  
  const handleMouseLeave = () => {
    setActivePackage(null);
  };
  
  // Calculate discounted price if there's an active offer
  const getDisplayPrice = (basePrice: number, packageId: number) => {
    if (activeOffer && activeOffer.packageId === packageId) {
      return basePrice * (1 - (activeOffer.discountPercent / 100));
    }
    return basePrice;
  };
  
  // Calculate price based on interval
  const getDisplayedPrice = (pkg: Package, packageId: number, interval: 'monthly'|'annually') => {
    const basePrice = pkg.price / 100; // Convert cents to dollars
    const price = getDisplayPrice(basePrice, packageId);
    return interval === 'annually' ? price * 12 * 0.8 : price; // Annual gets 20% discount
  };
  
  return (
    <>
      <Helmet>
        <title>Premium Pricing Plans | TwitchViewer.com</title>
        <meta name="description" content="Choose the perfect plan to boost your Twitch channel's growth. Get real viewers, followers and engagement with our premium services." />
        <meta name="keywords" content="Twitch viewers, Twitch growth, Twitch pricing, stream viewers" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-50 to-neutral-100">
        <LimitedTimeOfferBanner />
        <Navbar />
        {/* Hero Section with Gradient Background */}
        <div className="relative overflow-hidden pt-24 pb-32">
          {/* Abstract background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-l from-primary/10 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-tr-full"></div>
          
          {/* Animated particles */}
          <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-primary animate-pulse"></div>
          <div className="absolute top-3/4 left-1/2 w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" style={{animationDelay: '1s'}}></div>
          
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Heading */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Premium Growth Plans
                </span>
              </h1>
              <p className="mt-6 text-lg text-neutral-600 max-w-2xl mx-auto">
                Choose the perfect plan to skyrocket your Twitch presence. Our premium services 
                provide real viewers and engagement for sustainable channel growth.
              </p>
            </div>
            
            {/* Pricing toggle */}
            <div className="mt-12 flex justify-center">
              <div className="bg-white p-1 rounded-lg shadow-soft inline-flex">
                <button 
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    selectedInterval === 'monthly' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  onClick={() => setSelectedInterval('monthly')}
                >
                  Monthly
                </button>
                <button 
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center ${
                    selectedInterval === 'annually' 
                      ? 'bg-primary text-white shadow-sm' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  onClick={() => setSelectedInterval('annually')}
                >
                  Annually
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
            
            {/* Limited time offer banner (if exists) */}
            {activeOffer && (
              <motion.div 
                className="mt-8 max-w-2xl mx-auto bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-lg relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="absolute top-0 right-0 h-full w-20 text-white opacity-10" />
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-yellow-300" />
                  <span className="font-bold">{activeOffer.title}</span>
                  {activeOffer.couponCode && (
                    <span className="ml-2 bg-white bg-opacity-20 text-white px-2 py-1 rounded text-sm font-mono">
                      {activeOffer.couponCode}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm opacity-90">{activeOffer.description}</p>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Pricing Cards Section */}
        <div className="relative -mt-20 pb-24">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => {
                const isPopular = index === 1; // Middle package is typically the most popular
                const displayPrice = getDisplayedPrice(pkg, pkg.id, selectedInterval);
                const hasDiscount = activeOffer && activeOffer.packageId === pkg.id;
                
                return (
                  <motion.div
                    key={pkg.id}
                    className={`relative rounded-2xl overflow-hidden ${
                      activePackage === pkg.id 
                        ? 'shadow-2xl scale-105 z-10' 
                        : 'shadow-elevated hover:shadow-lg'
                    } bg-white transition-all duration-300`}
                    onMouseEnter={() => handleMouseEnter(pkg.id)}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {/* Gradient accent on top */}
                    <div className="h-2 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"></div>
                    
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-r from-primary to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg shadow-md">
                          MOST POPULAR
                        </div>
                      </div>
                    )}
                    
                    {/* Sale badge */}
                    {hasDiscount && (
                      <div className="absolute top-12 right-0">
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-4 py-1 rounded-l-lg shadow-md">
                          SALE {activeOffer.discountPercent}% OFF
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-neutral-800">{pkg.name}</h3>
                      <p className="mt-2 text-neutral-600 min-h-[50px]">{pkg.description}</p>
                      
                      <div className="mt-6 flex items-baseline">
                        {hasDiscount && (
                          <span className="text-lg line-through text-neutral-400 mr-2">
                            ${selectedInterval === 'monthly' ? (pkg.price / 100).toFixed(0) : ((pkg.price / 100) * 12 * 0.8).toFixed(0)}
                          </span>
                        )}
                        <span className="text-5xl font-extrabold text-neutral-900">${displayPrice.toFixed(0)}</span>
                        <span className="ml-1 text-neutral-500">
                          /{selectedInterval === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                      
                      <ul className="mt-8 space-y-4">
                        {pkg.features && pkg.features.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-neutral-600">{feature.trim()}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-8">
                        <Button 
                          className={`w-full py-6 ${
                            isPopular 
                              ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90' 
                              : 'bg-neutral-800 hover:bg-neutral-700'
                          } text-white rounded-xl flex items-center justify-center`}
                          onClick={() => {
                            // Handle purchase
                            setLocation("/checkout");
                          }}
                        >
                          Get Started
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="bg-white py-16">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-800">Trusted by Thousands of Streamers</h2>
              <p className="mt-4 text-lg text-neutral-600">Our secure platform handles Twitch growth for thousands of satisfied streamers</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-neutral-800">100% Secure Payments</h3>
                <p className="mt-2 text-sm text-neutral-600">All transactions are secure and encrypted</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-800">Cancellation Anytime</h3>
                <p className="mt-2 text-sm text-neutral-600">No contracts, cancel your subscription anytime</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-800">Instant Setup</h3>
                <p className="mt-2 text-sm text-neutral-600">Get started in minutes, see results immediately</p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-800">24/7 Support</h3>
                <p className="mt-2 text-sm text-neutral-600">Our dedicated team is here to help you</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-neutral-50 py-20">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-neutral-800">Frequently Asked Questions</h2>
              <p className="mt-4 text-lg text-neutral-600">Find answers to common questions about our pricing and services</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-neutral-800">How do your services work?</h3>
                <p className="mt-2 text-neutral-600">Our platform connects your Twitch channel with real viewers who are interested in your content. We use advanced algorithms to match your stream with the right audience for organic growth.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-neutral-800">Are these viewers real people?</h3>
                <p className="mt-2 text-neutral-600">Yes, our services provide real human viewers, not bots. This ensures genuine engagement and sustainable growth for your channel.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-neutral-800">Can I cancel my subscription anytime?</h3>
                <p className="mt-2 text-neutral-600">Absolutely! You can cancel your subscription at any time with no questions asked. There are no long-term contracts or hidden fees.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-neutral-800">Do you offer refunds?</h3>
                <p className="mt-2 text-neutral-600">We offer a 7-day money-back guarantee if you're not satisfied with our services. Simply contact our support team to request a refund.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-soft transition-all duration-300 hover:shadow-md">
                <h3 className="text-lg font-semibold text-neutral-800">Is this against Twitch's Terms of Service?</h3>
                <p className="mt-2 text-neutral-600">Our services are designed to be fully compliant with Twitch's Terms of Service. We provide genuine engagement from real users who are interested in your content.</p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-neutral-600">Still have questions?</p>
              <Button 
                variant="outline"
                className="mt-4 bg-white hover:bg-neutral-50"
                onClick={() => setLocation("/contact")}
              >
                Contact Our Support Team
              </Button>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 py-16 text-white">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Grow Your Twitch Channel?</h2>
            <p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
              Join thousands of streamers who have transformed their Twitch presence with our premium growth services.
            </p>
            <Button 
              className="mt-8 bg-white text-primary hover:bg-neutral-100 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                const topPackage = packages.find(pkg => pkg.name === "Premium");
                const packageId = topPackage?.id || packages[packages.length - 1]?.id;
                setLocation(`/checkout?package=${packageId}`);
              }}
            >
              Get Started Today
            </Button>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}