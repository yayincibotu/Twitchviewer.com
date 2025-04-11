import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2, Star, TwitchIcon, Youtube } from "lucide-react";
import { SiTwitch, SiYoutube } from "react-icons/si";

type SuccessStory = {
  id: number;
  streamerName: string;
  streamerAvatar: string | null;
  platformType: string;
  beforeCount: number;
  afterCount: number;
  growthPercent: number;
  testimonial: string;
  isVerified: boolean;
  isVisible: boolean;
  order: number;
};

export default function SuccessStoriesSection() {
  const { data: stories, isLoading, error } = useQuery<SuccessStory[]>({
    queryKey: ['/api/success-stories'],
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Platform icon helper
  const getPlatformIcon = (platformType: string) => {
    switch (platformType.toLowerCase()) {
      case 'twitch':
        return <SiTwitch className="h-5 w-5 text-purple-500" />;
      case 'youtube':
        return <SiYoutube className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  // Auto slide function
  const startAutoSlide = useCallback(() => {
    if (slideInterval.current) clearInterval(slideInterval.current);
    
    slideInterval.current = setInterval(() => {
      if (!stories || stories.length <= 1) return;
      
      setCurrentIndex(prevIndex => (prevIndex + 1) % stories.length);
    }, 5000); // 5 saniye aralıkla geçiş
  }, [stories]);

  // Başlangıçta otomatik geçişi başlat
  useEffect(() => {
    startAutoSlide();
    
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [startAutoSlide]);

  // Geçiş fonksiyonları
  const goToPrev = () => {
    if (!stories) return;
    
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
    startAutoSlide(); // Manuel geçişten sonra otomatiği yeniden başlat
  };

  const goToNext = () => {
    if (!stories) return;
    
    setCurrentIndex(prevIndex => 
      (prevIndex + 1) % stories.length
    );
    startAutoSlide(); // Manuel geçişten sonra otomatiği yeniden başlat
  };

  // Belirli slide'a gitme
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoSlide();
  };

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !stories || stories.length === 0) {
    return null;
  }

  const sortedStories = [...stories].sort((a, b) => a.order - b.order);
  const currentStory = sortedStories[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50" id="success-stories">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Başarı Hikayeleri</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Yayıncılarımızın gerçek sonuçları. İşte TwitchViewer ile elde ettikleri başarılar.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative" ref={containerRef}>
          {/* Slider kontrolleri */}
          <button 
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100"
            aria-label="Previous story"
          >
            <ChevronLeft className="h-6 w-6 text-neutral-700" />
          </button>
          
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-neutral-100"
            aria-label="Next story"
          >
            <ChevronRight className="h-6 w-6 text-neutral-700" />
          </button>

          {/* Success story card */}
          <div className="bg-white rounded-xl shadow-xl p-8 transition-all duration-500">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sol taraf - Avatar ve bilgiler */}
              <div className="md:w-1/3 flex flex-col items-center">
                <div className="relative mb-4">
                  {currentStory.streamerAvatar ? (
                    <img 
                      src={currentStory.streamerAvatar} 
                      alt={currentStory.streamerName} 
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-neutral-200 flex items-center justify-center">
                      <Users className="h-16 w-16 text-neutral-400" />
                    </div>
                  )}
                  
                  {/* Platform rozeti */}
                  <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                    {getPlatformIcon(currentStory.platformType)}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
                  {currentStory.streamerName}
                  {currentStory.isVerified && (
                    <span className="text-blue-500" title="Doğrulanmış">✓</span>
                  )}
                </h3>
                
                <div className="bg-neutral-100 p-4 rounded-lg w-full">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Önceki İzleyici:</span>
                    <span className="font-bold">{currentStory.beforeCount}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Sonraki İzleyici:</span>
                    <span className="font-bold">{currentStory.afterCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Büyüme:</span>
                    <span className="font-bold text-green-500">+{currentStory.growthPercent}%</span>
                  </div>
                </div>
              </div>
              
              {/* Sağ taraf - Testimonial */}
              <div className="md:w-2/3">
                <div className="h-full flex flex-col">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl text-neutral-800 italic flex-grow mb-6">
                    "{currentStory.testimonial}"
                  </blockquote>
                  
                  <div className="mt-auto">
                    <p className="text-sm text-neutral-500">
                      Sonuçlar kullanıcıdan kullanıcıya değişiklik gösterebilir. Yukarıdaki sonuçlar doğrulanmıştır.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slider göstergeleri */}
          <div className="flex justify-center mt-6 gap-2">
            {sortedStories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-neutral-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Fallback icon
function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}