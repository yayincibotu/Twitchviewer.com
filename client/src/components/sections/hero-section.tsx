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
                window.location.href = '/pricing';
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
              
              <div className="grid grid-cols-12 gap-3 mb-4">
                {/* Left side - Stats */}
                <div className="col-span-4 grid grid-rows-3 gap-3">
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
                
                {/* Middle - Chart */}
                <div className="col-span-4 flex flex-col bg-neutral-800/30 rounded-lg p-3">
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
                
                {/* Right side - Chat and Notifications */}
                <div className="col-span-4 flex flex-col gap-3">
                  {/* Chat box */}
                  <div className="flex-1 flex flex-col bg-neutral-800/50 rounded-lg overflow-hidden">
                    <div className="bg-neutral-800/80 px-3 py-2 flex items-center">
                      <svg className="w-4 h-4 text-neutral-400 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                      </svg>
                      <div className="text-neutral-300 text-xs">Chat</div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 h-28 bg-neutral-900/50">
                      {chatMessages.map(message => (
                        <div key={message.id} className="mb-1 last:mb-0 animate-fade-in">
                          <span className="text-xs" style={{ color: message.color }}>
                            {message.username}:
                          </span>
                          <span className="text-xs text-neutral-300 ml-1">{message.message}</span>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                  
                  {/* Notifications */}
                  <div className="h-32 bg-neutral-800/30 rounded-lg p-2 overflow-hidden">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="mb-2 last:mb-0 p-2 bg-purple-500/20 rounded-md border border-purple-500/20 animate-slide-right">
                        {notification.type === 'follow' && (
                          <div className="flex items-center">
                            <div className="mr-2 bg-purple-600/30 p-1 rounded">
                              <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                              </svg>
                            </div>
                            <div className="text-xs text-neutral-200">
                              <span className="font-semibold text-purple-300">{notification.username}</span> just followed!
                            </div>
                          </div>
                        )}
                        {notification.type === 'subscription' && (
                          <div className="flex items-center">
                            <div className="mr-2 bg-blue-600/30 p-1 rounded">
                              <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z" />
                              </svg>
                            </div>
                            <div className="text-xs text-neutral-200">
                              <span className="font-semibold text-blue-300">{notification.username}</span> subscribed!
                            </div>
                          </div>
                        )}
                        {notification.type === 'donation' && (
                          <div className="flex items-center">
                            <div className="mr-2 bg-green-600/30 p-1 rounded">
                              <svg className="w-3 h-3 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
                              </svg>
                            </div>
                            <div className="text-xs text-neutral-200">
                              <span className="font-semibold text-green-300">{notification.username}</span> donated{' '}
                              <span className="font-bold text-green-300">${notification.amount}</span>!
                            </div>
                          </div>
                        )}
                      </div>
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
