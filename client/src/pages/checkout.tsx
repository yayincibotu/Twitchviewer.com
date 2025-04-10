import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Helmet } from "react-helmet";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// The actual checkout form with Stripe Elements
const CheckoutForm = ({ packageId, packageName, price }: { packageId: number; packageName: string; price: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // In a real app, this would confirm the payment with Stripe
      // For now, we'll just make our simulated checkout endpoint
      const response = await apiRequest('POST', '/api/create-checkout-session', {
        priceId: `price_${packageId}`
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Payment Successful",
          description: "Your subscription has been activated successfully!",
        });
        
        // Redirect to dashboard after successful payment
        setLocation("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border p-4 rounded-md bg-white">
        <h3 className="font-medium text-lg mb-2">Order Summary</h3>
        <div className="flex justify-between py-2 border-b">
          <span>{packageName} Package</span>
          <span>${(price / 100).toFixed(2)}/month</span>
        </div>
        <div className="flex justify-between py-2 font-semibold">
          <span>Total</span>
          <span>${(price / 100).toFixed(2)}/month</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Payment Method</h3>
        <div className="border p-4 rounded-md bg-white">
          {/* This would show a simulated Stripe payment form */}
          <div className="bg-neutral-100 p-4 rounded border border-neutral-200 mb-4">
            <div className="h-8 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
            <div className="h-8 mt-4 bg-neutral-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="h-8 bg-neutral-200 rounded animate-pulse"></div>
              <div className="h-8 bg-neutral-200 rounded animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm text-neutral-500">
            Your card information is secured with industry-standard encryption.
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full py-6 bg-primary hover:bg-primary-dark"
        disabled={!stripe || processing}
      >
        {processing ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        Pay ${(price / 100).toFixed(2)} and Subscribe
      </Button>
      
      <p className="text-center text-sm text-neutral-500">
        By clicking above, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
};

// The checkout page wrapper
export default function CheckoutPage() {
  const [, params] = useRoute<{ packageId: string }>("/checkout/:packageId");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [packageData, setPackageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to continue with your purchase.",
      });
      setLocation("/auth");
      return;
    }
    
    // Check if user's email is verified
    if (user && !user.emailVerified) {
      toast({
        title: "Email Verification Required",
        description: "Please verify your email before making a purchase.",
      });
      setLocation("/dashboard");
      return;
    }
    
    if (params && params.packageId) {
      // Load package data
      fetch(`/api/packages/${params.packageId}`)
        .then(res => {
          if (!res.ok) {
            throw new Error("Package not found");
          }
          return res.json();
        })
        .then(data => {
          setPackageData(data);
          setLoading(false);
        })
        .catch(error => {
          toast({
            title: "Error",
            description: error.message || "Failed to load package details",
            variant: "destructive",
          });
          setLocation("/");
        });
    } else {
      toast({
        title: "Invalid Package",
        description: "Please select a valid package",
        variant: "destructive",
      });
      setLocation("/");
    }
  }, [user, params, setLocation, toast]);

  // Show loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Checkout - TwitchViewer.com</title>
          <meta name="description" content="Complete your subscription purchase for TwitchViewer services." />
        </Helmet>
        
        <div className="min-h-screen flex flex-col bg-neutral-100">
          <Navbar />
          
          <main className="flex-grow flex items-center justify-center py-12">
            <div className="flex justify-center items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          </main>
          
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout - TwitchViewer.com</title>
        <meta name="description" content="Complete your subscription purchase for TwitchViewer services." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Navbar />
        
        <main className="flex-grow py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold text-neutral-800 mb-8">Complete Your Purchase</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="md:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>
                      Subscribe to the {packageData?.name} plan to boost your Twitch channel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {packageData && (
                      <Elements
                        stripe={stripePromise}
                        options={{
                          // This would normally pass clientSecret from a real Stripe setup
                          appearance: { theme: 'stripe' },
                        }}
                      >
                        <CheckoutForm 
                          packageId={packageData.id} 
                          packageName={packageData.name}
                          price={packageData.price}
                        />
                      </Elements>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{packageData?.name}</CardTitle>
                    <CardDescription>
                      {packageData?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ${packageData?.price ? (packageData.price / 100).toFixed(2) : '0.00'}<span className="text-sm text-neutral-500">/month</span>
                        </p>
                        <p className="text-sm text-neutral-500">Cancel anytime</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Features:</h3>
                        <ul className="space-y-2">
                          {packageData?.features?.map((feature: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setLocation("/#pricing")}
                    >
                      Change Plan
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}