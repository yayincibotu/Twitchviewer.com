import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Simüle edilmiş gerçek zamanlı izleyici sayısı animasyonu
  useEffect(() => {
    const target = 1572;
    const initialValue = Math.floor(target * 0.9);
    setViewerCount(initialValue);
    
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 ile +2 arasında değişim
        const newValue = Math.max(initialValue, Math.min(prev + change, target + 10));
        return newValue;
      });
    }, 3000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
      {/* Animasyonlu geometrik arkaplan */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-white"></div>
      <div className="absolute inset-0 hero-pattern opacity-5"></div>
      
      {/* Dekoratif elementler */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className={`text-center max-w-3xl mx-auto ${isScrolled ? 'opacity-90 transform -translate-y-4' : ''} transition-all duration-700`}>
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4 animate-fade-in">
            <span className="inline-block h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Live Now: {viewerCount.toLocaleString()} viewers on our network
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="animate-slide-down inline-block bg-gradient-to-r from-primary via-violet-600 to-purple-600 bg-clip-text text-transparent">Boost Your Twitch Channel</span><br />
            <span className="animate-slide-up inline-block text-neutral-800" style={{animationDelay: '0.3s'}}>With Real Viewers</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.5s'}}>
            Grow your channel naturally using our automated Twitch viewer system. Reach more followers and increase your stream's visibility.
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="btn-gradient px-8 py-6 text-base animate-fade-in"
              style={{animationDelay: '0.7s'}}
              onClick={() => {
                const pricingSection = document.getElementById('pricing');
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              See Pricing
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-6 bg-white hover:bg-neutral-50 rounded-xl font-semibold text-primary border border-neutral-200 hover:border-primary/30 shadow-soft hover:shadow-elevated transition-all duration-300 animate-fade-in"
              style={{animationDelay: '0.8s'}}
              onClick={onGetStarted}
            >
              Try For Free
            </Button>
          </div>
          
          <div className="mt-12 animate-fade-in" style={{animationDelay: '0.9s'}}>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700">Real Viewers</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700">Instant Setup</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700">24/7 Support</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-neutral-700">TOS Compliant</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 relative animate-fade-in" style={{animationDelay: '1s'}}>
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-elevated">
            {/* Dashboard header */}
            <div className="bg-neutral-800 p-2 sm:p-3 flex items-center space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="ml-2 text-neutral-300 text-xs font-medium">TwitchViewer Dashboard</div>
            </div>
            
            {/* Dashboard content */}
            <div className="bg-neutral-900 w-full h-auto aspect-video p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4 bg-neutral-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded bg-purple-600 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 3h16v12h-6l-4 4v-4H4V3zm12 4h-2v4h2V7zm-6 0h2v4h-2V7z" />
                    </svg>
                  </div>
                  <div className="text-white font-medium">YourTwitchChannel</div>
                </div>
                <div className="flex items-center">
                  <div className="px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs font-medium">Live</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-neutral-800/40 rounded-lg p-3">
                  <div className="text-neutral-400 text-xs mb-1">Current Viewers</div>
                  <div className="text-white text-xl font-bold">{(viewerCount * 0.1).toFixed(0)}</div>
                  <div className="text-green-400 text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14l5-5 5 5H7z" />
                    </svg>
                    +12.4%
                  </div>
                </div>
                <div className="bg-neutral-800/40 rounded-lg p-3">
                  <div className="text-neutral-400 text-xs mb-1">Followers Today</div>
                  <div className="text-white text-xl font-bold">26</div>
                  <div className="text-green-400 text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14l5-5 5 5H7z" />
                    </svg>
                    +7.8%
                  </div>
                </div>
                <div className="bg-neutral-800/40 rounded-lg p-3">
                  <div className="text-neutral-400 text-xs mb-1">Channel Rank</div>
                  <div className="text-white text-xl font-bold">#1,342</div>
                  <div className="text-green-400 text-xs flex items-center mt-1">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 14l5-5 5 5H7z" />
                    </svg>
                    +128
                  </div>
                </div>
              </div>
              
              <div className="flex-1 bg-neutral-800/30 rounded-lg p-3 flex flex-col">
                <div className="text-neutral-400 text-xs mb-2">Viewer Activity (Last 24 hours)</div>
                <div className="flex-1 flex items-end">
                  <div className="flex-1 flex items-end space-x-1">
                    {[15, 25, 20, 30, 35, 40, 42, 50, 45, 48, 60, 70, 65, 75, 85, 80, 90, 100, 95, 98].map((height, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-primary to-purple-600 rounded-sm" 
                        style={{ height: `${height}%`, transitionDelay: `${i * 50}ms` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fancy gradient glow effect */}
          <div className="absolute -top-8 -right-8 -bottom-8 -left-8 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-2xl -z-10 blur-2xl opacity-70"></div>
        </div>
      </div>
    </section>
  );
}
