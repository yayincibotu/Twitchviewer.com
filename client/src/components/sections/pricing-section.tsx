import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2, Check, ChevronRight, Sparkles } from "lucide-react";
import { useRef, useEffect } from "react";

interface PricingSectionProps {
  simplified?: boolean;
}

export default function PricingSection({ simplified = false }: PricingSectionProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // Fetch packages from API
  const { data: packages, isLoading } = useQuery<any[]>({
    queryKey: ['/api/packages'],
  });

  useEffect(() => {
    // Sayfa yüklendiğinde animasyonları başlat
    setTimeout(() => {
      if (sectionRef.current) {
        sectionRef.current.classList.remove('opacity-0');
        sectionRef.current.classList.add('animate-fade-in');
      }

      cardsRef.current.forEach((card, index) => {
        if (card) {
          setTimeout(() => {
            card.classList.remove('opacity-0');
            card.classList.add('animate-slide-up');
          }, 300 + index * 150);
        }
      });
    }, 300);
  }, [packages]);

  const handleSubscribe = (packageId: number) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    // Redirect to checkout page with the package ID
    setLocation(`/checkout/${packageId}`);
  };

  // Özel gradyan tanımları
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-amber-400 to-orange-500"
  ];

  if (isLoading) {
    return (
      <section id="pricing" className="py-20 bg-gradient-to-b from-white to-neutral-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="pricing" 
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-white to-neutral-50 relative overflow-hidden opacity-0"
    >
      {/* Dekoratif arka plan elementleri */}
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {!simplified && (
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-800 font-heading">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
              Choose the plan that fits your streaming needs. All plans include our core features with no hidden fees.
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        )}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {packages && packages.length > 0 ? packages.map((pkg: any, index: number) => (
            <div 
              key={pkg.id} 
              ref={(el) => (cardsRef.current[index] = el)}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-soft opacity-0 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-elevated ${
                index === 1 ? 'ring-2 ring-primary lg:scale-105' : 'hover:ring-1 hover:ring-primary/30'
              }`}
            >
              {index === 1 && (
                <>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-violet-500 to-purple-500"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-primary to-violet-600 text-white text-xs font-bold uppercase tracking-wide py-1.5 px-3 rounded-full shadow-md">Popular</span>
                  </div>
                </>
              )}
              
              <div className={`px-6 py-8 ${index === 1 ? 'pt-10' : ''}`}>
                <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br text-white ${gradients[index % gradients.length]}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-800 font-heading">{pkg.name}</h3>
                
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold text-neutral-800">${(pkg.price / 100).toFixed(0)}</span>
                  <span className="text-neutral-500 ml-1 text-lg">/month</span>
                </div>
                
                <p className="mt-4 text-neutral-600 leading-relaxed">
                  {pkg.description}
                </p>
                
                <div className="my-8 h-px bg-neutral-100"></div>
                
                <ul className="space-y-4">
                  {pkg.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className={`flex-shrink-0 h-5 w-5 rounded-full ${index === 1 ? 'bg-primary/10 text-primary' : 'bg-green-100 text-green-600'} flex items-center justify-center mt-0.5`}>
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="ml-3 text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="px-6 pb-8">
                <Button 
                  onClick={() => handleSubscribe(pkg.id)}
                  className={`w-full py-6 rounded-xl text-center font-medium transition-all duration-300 ${
                    index === 1 
                      ? 'btn-gradient shadow-button hover:shadow-xl' 
                      : 'bg-white hover:bg-neutral-50 text-primary border border-neutral-200 hover:border-primary/30 shadow-soft hover:shadow-md'
                  }`}
                >
                  {index === 1 ? 'Get Started' : 'Subscribe Now'}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="mt-4 text-center text-sm text-neutral-500">
                  {index === 1 ? 'Recommended for most streamers' : 'No credit card required'}
                </p>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-neutral-600">No pricing packages available</p>
            </div>
          )}
        </div>

        <div className="mt-16 text-center bg-white rounded-2xl p-8 shadow-soft">
          <h3 className="text-xl font-bold text-neutral-800 font-heading">Need a Custom Plan?</h3>
          <p className="mt-4 text-neutral-600 max-w-2xl mx-auto">
            Have specific requirements or need more viewers? Contact our team for a tailored solution that fits your unique streaming goals.
          </p>
          <Button 
            variant="outline"
            className="mt-6 px-6 py-3 bg-white hover:bg-neutral-50 text-primary border border-neutral-200 hover:border-primary/30 rounded-xl shadow-soft hover:shadow-md transition-all duration-300"
            onClick={() => {
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
