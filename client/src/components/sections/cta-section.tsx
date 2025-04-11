import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function CtaSection() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleTryFree = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      setLocation("/auth");
    }
  };

  const handleSeePricing = () => {
    window.location.href = '/pricing';
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Ready to Grow Your Twitch Channel?
        </h2>
        <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
          Join thousands of streamers who have boosted their channel with TwitchViewer.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleTryFree}
            className="px-8 py-6 bg-white text-primary rounded-lg font-semibold shadow-lg hover:bg-neutral-100 transition-colors duration-200"
          >
            Try For Free
          </Button>
          <Button 
            onClick={handleSeePricing}
            className="px-8 py-6 bg-accent text-primary font-semibold rounded-lg shadow-lg hover:bg-accent/90 transition-colors duration-200"
          >
            See Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
