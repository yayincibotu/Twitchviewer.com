import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

interface PricingSectionProps {
  simplified?: boolean;
}

export default function PricingSection({ simplified = false }: PricingSectionProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch packages from API
  const { data: packages, isLoading } = useQuery({
    queryKey: ['/api/packages'],
  });

  const handleSubscribe = (stripePriceId: string) => {
    if (!user) {
      setLocation("/auth");
      return;
    }
    
    // In a real app with Stripe fully integrated, this would redirect to Stripe checkout
    // But for now we'll just log and redirect to dashboard to simulate the flow
    console.log(`Subscribe to package with Stripe Price ID: ${stripePriceId}`);
    setLocation("/dashboard");
  };

  if (isLoading) {
    return (
      <section id="pricing" className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!simplified && (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-800 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Choose the plan that fits your streaming needs. All plans include our core features.
            </p>
          </div>
        )}

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {packages?.map((pkg: any, index: number) => (
            <div 
              key={pkg.id} 
              className={`bg-white rounded-xl overflow-hidden border ${index === 1 ? 'border-2 border-primary shadow-xl' : 'border-neutral-200 hover:border-primary/30'} transition-colors duration-300 hover:shadow-xl`}
            >
              {index === 1 && (
                <>
                  <div className="absolute top-0 inset-x-0">
                    <div className="h-1.5 bg-gradient-to-r from-primary to-accent rounded-b-lg"></div>
                  </div>
                  <div className="absolute top-5 right-5">
                    <span className="bg-accent text-primary text-xs font-bold uppercase tracking-wide py-1 px-3 rounded-full">Popular</span>
                  </div>
                </>
              )}
              <div className={`p-6 ${index === 1 ? 'pt-8' : ''}`}>
                <h3 className="text-xl font-bold text-neutral-800">{pkg.name}</h3>
                <div className="mt-4 flex items-end">
                  <span className="text-4xl font-bold text-neutral-800">${(pkg.price / 100).toFixed(0)}</span>
                  <span className="text-neutral-500 ml-1">/month</span>
                </div>
                <p className="mt-2 text-neutral-600">
                  {pkg.description}
                </p>
                <ul className="mt-6 space-y-3">
                  {pkg.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-2 text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-neutral-50 border-t border-neutral-200">
                <Button 
                  onClick={() => handleSubscribe(pkg.stripePriceId)}
                  className={`w-full py-3 px-4 rounded-lg text-center font-medium ${
                    index === 1 
                      ? 'bg-primary hover:bg-primary-dark text-white transition-colors duration-200 shadow-lg shadow-primary/30' 
                      : 'bg-white hover:bg-neutral-100 text-primary border border-primary/30 hover:border-primary transition-colors duration-200'
                  }`}
                >
                  Subscribe Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-neutral-600">
            Need a custom solution? <a href="#contact" className="text-primary font-medium hover:underline">Contact us</a> for personalized pricing.
          </p>
        </div>
      </div>
    </section>
  );
}
