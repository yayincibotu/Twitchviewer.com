import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  color: string;
  timestamp: Date;
}

interface EventNotification {
  id: number;
  type: 'follow' | 'subscription' | 'donation';
  username: string;
  amount?: number;
  timestamp: Date;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [viewerCount, setViewerCount] = useState(0);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<EventNotification[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const getRandomUsername = () => {
    const usernames = [
      'TwitchFan', 'GameLover', 'StreamViewer', 'PurpleFan', 
      'ViewerBot', 'ChatterPro', 'StreamSupport', 'TwitchLurker', 
      'ViewerOne', 'ChatChamp', 'StreamHelper', 'TwitchGrow',
      'GamingLife', 'StreamBooster', 'LoyalViewer'
    ];
    const randomNumber = Math.floor(Math.random() * 1000);
    return `${usernames[Math.floor(Math.random() * usernames.length)]}${randomNumber}`;
  };
  
  const getRandomColor = () => {
    const colors = ['#ff4500', '#0e9216', '#1e90ff', '#9147ff', '#f2a900', '#00ced1', '#ff69b4', '#2ecc71'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const getRandomMessage = () => {
    const messages = [
      'Great stream today!',
      'Love the content!',
      'Wow, that was amazing!',
      'How long have you been streaming?',
      'First time here, loving it!',
      'Hello from Germany!',
      'Followed! Great content!',
      'Keep it up!',
      'This stream is fire!',
      'LUL',
      'PogChamp',
      'What game is next?',
      'You are so skilled!',
      'Can you do a tutorial on that?',
      'Your channel is growing fast!',
      'Quality content as always'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  // Simüle edilmiş gerçek zamanlı izleyici sayısı ve chat animasyonu
  useEffect(() => {
    const target = 1572;
    const initialValue = Math.floor(target * 0.9);
    setViewerCount(initialValue);
    
    // Add initial chat messages
    const initialMessages: ChatMessage[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      username: getRandomUsername(),
      message: getRandomMessage(),
      color: getRandomColor(),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 300000))
    }));
    
    setChatMessages(initialMessages);
    
    // Simulate viewer count changing
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 5) - 1; // -1 to +3 range for more growth
        const newValue = Math.max(initialValue, Math.min(prev + change, target + 30));
        return newValue;
      });
    }, 3000);
    
    // Simulate new chat messages
    const chatInterval = setInterval(() => {
      const newMessage: ChatMessage = {
        id: Date.now(),
        username: getRandomUsername(),
        message: getRandomMessage(),
        color: getRandomColor(),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev.slice(-9), newMessage]); // Keep last 10 messages
    }, 4000);
    
    // Simulate follower/subscriber events
    const notificationInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% chance to show notification
        const eventTypes: ('follow' | 'subscription' | 'donation')[] = ['follow', 'subscription', 'donation'];
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        
        const newNotification: EventNotification = {
          id: Date.now(),
          type: eventType,
          username: getRandomUsername(),
          amount: eventType === 'donation' ? Math.floor(Math.random() * 50) + 5 : undefined,
          timestamp: new Date()
        };
        
        setNotifications(prev => [...prev.slice(-2), newNotification]); // Keep last 3 notifications
      }
    }, 13000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
      clearInterval(notificationInterval);
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
          <div className="relative max-w-4xl mx-auto rounded-lg overflow-hidden shadow-elevated">
            {/* Twitch Stream Header - Based on reference image */}
            <div className="bg-[#18181b] p-2 flex items-center justify-between border-b border-[#303032]">
              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-1">
                  {['home', 'browse', 'esports', 'music'].map((item, i) => (
                    <div key={i} className="text-[#efeff1] text-xs px-2 py-1 uppercase hover:bg-[#303032] cursor-pointer rounded">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-[#3a3a3d] text-[#efeff1] text-xs rounded px-3 py-1 mr-2">
                  STREAM CHAT
                </div>
              </div>
            </div>
            
            {/* Live stream content - grid layout with main view and chat */}
            <div className="grid grid-cols-12">
              {/* Main stream view */}
              <div className="col-span-9 relative bg-[#0e0e10]">
                {/* Game footage - FPS game animation */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e10]/80 via-transparent to-transparent z-10"></div>
                  
                  {/* FPS game animation */}
                  <div className="w-full h-full bg-[#18181b] relative overflow-hidden">
                    {/* Game world with moving elements */}
                    <div className="absolute inset-0 w-full h-full" 
                         style={{ 
                           background: 'linear-gradient(to bottom, #1a2a3a 0%, #2c3e50 100%)'
                         }}>
                      
                      {/* Moving environment elements */}
                      <div className="absolute top-0 left-0 w-full h-16 opacity-20"
                           style={{ 
                             background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                             animation: 'shine 3s ease-in-out infinite'
                           }}></div>
                      
                      {/* Moving clouds */}
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={`cloud-${i}`}
                          className="absolute bg-white/5 rounded-full"
                          style={{
                            width: `${Math.floor(Math.random() * 120) + 40}px`,
                            height: `${Math.floor(Math.random() * 40) + 15}px`,
                            top: `${Math.floor(Math.random() * 40)}%`,
                            left: `${Math.floor(Math.random() * 100)}%`,
                            animation: `float ${Math.floor(Math.random() * 10) + 15}s linear infinite`,
                            animationDelay: `${Math.floor(Math.random() * 5)}s`,
                            opacity: 0.1 + Math.random() * 0.1,
                            transform: 'translateX(-100%)'
                          }}
                        ></div>
                      ))}
                      
                      {/* Game terrain/landscape */}
                      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-[#101418] to-transparent"></div>
                      
                      {/* FPS weapon view */}
                      <div className="absolute bottom-0 right-1/2 transform translate-x-1/2">
                        <div className="relative w-64 h-32 mb-[-10px]">
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-16 
                                         bg-gradient-to-t from-[#4a4a4a] to-[#2a2a2a] rounded-t-lg
                                         shadow-lg">
                            {/* Gun details */}
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-[#555] rounded-full"></div>
                            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-36 h-1 bg-[#444] rounded-full"></div>
                            
                            {/* Gun animation */}
                            <div className="w-full h-full animate-pulse-fast" style={{ animationDuration: '3s' }}></div>
                            
                            {/* Gun sight */}
                            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                              <div className="w-1 h-6 bg-red-500/30"></div>
                              <div className="w-6 h-1 bg-red-500/30"></div>
                              <div className="absolute w-1.5 h-1.5 rounded-full border border-red-500/50"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* HUD Elements */}
                      <div className="absolute top-4 right-4 flex items-center text-[#39ff14] text-xs font-mono">
                        <div className="mr-3">
                          <div>AMMO: 24/96</div>
                          <div>HEALTH: 85</div>
                        </div>
                        <div className="w-12 h-12 border border-[#39ff14]/30 rounded-full flex items-center justify-center">
                          <div className="w-10 h-10 border border-[#39ff14]/50 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-[#39ff14] rounded-full animate-ping opacity-70"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Muzzle flash animation that occasionally appears */}
                      {Math.random() > 0.7 && (
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                                        w-20 h-16 bg-yellow-500/30 rounded-full filter blur-sm animate-pulse"
                             style={{ animationDuration: '0.1s' }}>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Animated Streamer webcam overlay */}
                  <div className="absolute bottom-3 left-3 w-32 h-32 rounded overflow-hidden border-2 border-[#9147ff] z-20">
                    <div className="w-full h-full bg-[#1f1f23] relative">
                      {/* Animated streamer */}
                      <div className="absolute inset-0 w-full h-full flex flex-col justify-end">
                        {/* Streamer animation - a simple reactive animation that mimics someone playing an FPS */}
                        <div className="h-2/3 flex items-end">
                          <div className="w-full h-[70%] relative">
                            {/* Streamer head/shoulders silhouette */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-16">
                              <div className="absolute bottom-0 w-10 h-12 bg-gray-800 rounded-t-full left-1/2 transform -translate-x-1/2"></div>
                              <div className="absolute bottom-2 w-12 h-5 bg-gray-700 rounded-full left-1/2 transform -translate-x-1/2"></div>
                              
                              {/* Animated head movement */}
                              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-gray-600"
                                   style={{
                                     animation: 'float 3s ease-in-out infinite',
                                     animationDirection: 'alternate'
                                   }}>
                                {/* Eyes */}
                                <div className="flex justify-center space-x-2 pt-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                </div>
                                {/* Headset */}
                                <div className="absolute top-0 left-[-3px] w-2 h-4 bg-black rounded"></div>
                                <div className="absolute top-0 right-[-3px] w-2 h-4 bg-black rounded"></div>
                                <div className="absolute top-[-2px] left-[-1px] right-[-1px] h-1.5 bg-black rounded"></div>
                              </div>
                            </div>
                            
                            {/* Gaming chair */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-red-800 rounded-t-md"></div>
                          </div>
                        </div>
                        
                        {/* Webcam overlay gradient and info */}
                        <div className="w-full bg-gradient-to-t from-black/70 to-transparent px-2 py-1">
                          <div className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-red-500 mr-1 animate-pulse-fast"></div>
                            <span className="text-xs text-white font-medium">LIVE</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lighting effect overlays */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent"></div>
                      <div className="absolute inset-0 bg-gradient-to-bl from-red-500/5 to-transparent 
                                     animate-pulse-fast" style={{ animationDuration: '5s' }}></div>
                    </div>
                  </div>
                  
                  {/* Stream viewers count */}
                  <div className="absolute top-3 left-3 bg-[#18181b]/80 text-white text-xs px-2 py-1 rounded flex items-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                    <span>{(viewerCount * 0.1).toFixed(0)} viewers</span>
                  </div>
                  
                  {/* Stream controls */}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <div className="bg-[#18181b]/80 text-white p-1 rounded hover:bg-[#303032]/80 cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.5 8.5a1 1 0 011 0v3a1 1 0 01-1 0v-3zm4-1.5a1 1 0 00-.5.5v5a1 1 0 001 0v-5a1 1 0 00-.5-.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="bg-[#18181b]/80 text-white p-1 rounded hover:bg-[#303032]/80 cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="bg-[#18181b]/80 text-white p-1 rounded hover:bg-[#303032]/80 cursor-pointer">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H9.771l-.003.011-.004.013-.008.028-.022.084-.045.165-.104.343-.149.48a1 1 0 01-.1.219l-.75-.75.104-.343c.074-.245.141-.471.185-.626z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Stream info bar */}
                <div className="bg-[#0e0e10] p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-[#9147ff] rounded-full flex items-center justify-center text-white font-bold mr-2">G</div>
                      <div>
                        <div className="text-[#efeff1] font-bold text-sm">Glorious_E</div>
                        <div className="text-[#adadb8] text-xs">Let me cook 🍳 - !event o7 join my !socials | @glorious_e</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="bg-[#9147ff] text-white px-4 py-1 rounded-lg text-sm font-semibold hover:bg-[#772ce8]">
                        Follow
                      </button>
                      <button className="bg-transparent border border-[#3a3a3d] text-[#efeff1] px-3 py-1 rounded-lg text-sm flex items-center hover:bg-[#3a3a3d]/30">
                        Subscribe
                        <svg className="w-3 h-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Stream details */}
                <div className="bg-[#0e0e10] px-3 py-1 border-t border-[#303032] flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-[#adadb8] text-xs border border-[#303032] px-2 py-0.5 rounded mr-2">Escape from Tarkov</div>
                    <div className="text-[#adadb8] text-xs border border-[#303032] px-2 py-0.5 rounded mr-2">PVP</div>
                    <div className="text-[#adadb8] text-xs border border-[#303032] px-2 py-0.5 rounded mr-2">English</div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-[#adadb8] text-xs mr-2">3,108</div>
                    <div className="text-[#adadb8] text-xs">2:40:30</div>
                  </div>
                </div>
              </div>
              
              {/* Chat sidebar */}
              <div className="col-span-3 bg-[#1f1f23] h-full max-h-[460px] border-l border-[#303032] flex flex-col">
                <div className="p-2 border-b border-[#303032] text-sm text-[#adadb8] font-semibold">
                  STREAM CHAT
                </div>
                
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-2">
                  <div className="space-y-2">
                    {/* Subscriber list */}
                    <div className="flex items-center mb-3">
                      <div className="w-5 h-5 text-yellow-400 mr-1">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-yellow-400 text-xs font-bold">thehappycamper</div>
                      <div className="text-xs text-[#adadb8] ml-1">53</div>
                    </div>
                    
                    {/* Chat messages */}
                    {chatMessages.slice(0, 8).map((message, index) => (
                      <div key={index} className="animate-fade-in">
                        <span className="text-xs" style={{ color: message.color }}>
                          {message.username}:
                        </span>
                        <span className="text-xs text-[#adadb8] ml-1">{message.message}</span>
                      </div>
                    ))}
                    
                    {/* Some special formatted messages */}
                    <div>
                      <span className="text-xs text-blue-400">sakocean:</span>
                      <span className="text-xs text-[#adadb8] ml-1">you better stock up on some noodles. tariffs</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-purple-400">Fourtone:</span>
                      <span className="text-xs text-[#adadb8] ml-1">lchip</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-green-400">Greeshot:</span>
                      <span className="text-xs text-blue-400 ml-1 underline">https://clips.twitch.tv/BloodyKindHorse#links</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-blue-400">sawaquare:</span>
                      <span className="text-xs text-[#adadb8] ml-1">Dengo</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-red-400">cheekymogan:</span>
                      <span className="text-xs text-[#adadb8] ml-1">lchip</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-purple-400">capitalist:</span>
                      <span className="text-xs text-[#adadb8] ml-1">x3 budok kept me on the toplist for 4h</span>
                    </div>
                    
                    <div>
                      <span className="text-xs text-pink-400">wildburr:</span>
                      <span className="text-xs text-[#adadb8] ml-1">I don't think we need to remind you to order food bro 🍕</span>
                    </div>
                    
                    <div ref={chatEndRef} />
                  </div>
                </div>
                
                {/* Chat input */}
                <div className="p-2 border-t border-[#303032]">
                  <div className="rounded bg-[#3a3a3d] p-1 text-center text-xs text-[#adadb8]">
                    Send a message
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
