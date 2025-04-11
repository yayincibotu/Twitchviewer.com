import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { X, Clock, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type LimitedTimeOffer = {
  id: number;
  title: string;
  description: string;
  discountPercent: number;
  packageId: number | null;
  startDate: string;
  endDate: string;
  couponCode: string | null;
  isActive: boolean;
};

type Package = {
  id: number;
  name: string;
  description: string;
  price: number;
  maxViewers: number;
  features: string[];
  stripePriceId: string;
};

export default function LimitedTimeOfferBanner() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Teklifleri ve paketleri çek
  const { data: offers } = useQuery<LimitedTimeOffer[]>({
    queryKey: ['/api/limited-time-offers'],
  });

  const { data: packages } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  // Kullanıcının daha önce banner'ı kapatıp kapatmadığını kontrol et
  useEffect(() => {
    const isDismissed = localStorage.getItem('offer_dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  // Update the countdown timer
  useEffect(() => {
    if (!offers || offers.length === 0) return;

    // Filter active offers
    const activeOffer = offers[0]; // Use the first active offer by default
    if (!activeOffer) return;

    const endDate = new Date(activeOffer.endDate);
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Offer expired");
        return;
      }
      
      // Calculate countdown format
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [offers]);

  // Banner'ı kapat ve kullanıcı tercihini kaydet
  const dismissBanner = () => {
    setDismissed(true);
    localStorage.setItem('offer_dismissed', 'true');
  };

  // Teklif yoksa veya banner kapatıldıysa gösterme
  if (dismissed || !offers || offers.length === 0 || !timeLeft) {
    return null;
  }

  const offer = offers[0]; // İlk aktif teklifi kullan
  
  // Teklif edilen paketi bul
  const offeredPackage = packages?.find(pkg => pkg.id === offer.packageId);

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white py-2 relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 overflow-hidden h-8 top-1/2 -translate-y-1/2">
        <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-white opacity-10 animate-pulse"></div>
        <div className="absolute right-10 top-0 w-6 h-6 rounded-full bg-white opacity-10 animate-pulse delay-300"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <button 
          onClick={dismissBanner}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-200"
          aria-label="Close banner"
        >
          <X size={20} />
        </button>
        
        <div className="flex items-center justify-between pr-12 py-0.5">
          <div className="flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
            <span className="font-bold text-sm">{offer.title}</span>
            {offer.couponCode && (
              <span className="ml-2 bg-white bg-opacity-20 text-white px-1.5 py-0.5 rounded text-xs font-mono">
                {offer.couponCode}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <Clock className="mr-2 h-4 w-4 text-yellow-300" />
            <span className="text-sm">Time left: <strong>{timeLeft}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}