import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
      <div className="absolute inset-0 hero-pattern opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Boost Your Twitch Channel With Real Viewers
          </h1>
          <p className="mt-4 text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Grow your channel naturally using our automated Twitch viewer system. Reach more followers and increase your stream's visibility.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="px-8 py-6 bg-primary hover:bg-primary-dark rounded-lg font-semibold text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-200"
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
              className="px-8 py-6 bg-white hover:bg-neutral-100 rounded-lg font-semibold text-primary border border-neutral-200 hover:border-primary/30 shadow-sm hover:shadow transition-all duration-200"
              onClick={onGetStarted}
            >
              Try For Free
            </Button>
          </div>
          <div className="mt-12">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-neutral-600">Real Viewers</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-neutral-600">Instant Setup</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-neutral-600">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 relative">
          <div className="relative lg:max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl">
            <div className="bg-neutral-800 p-2 sm:p-3 flex items-center space-x-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="ml-2 text-neutral-400 text-xs">TwitchViewer Dashboard</div>
            </div>
            <div className="bg-neutral-900 w-full h-auto aspect-video flex items-center justify-center">
              <svg
                className="w-full h-full text-neutral-700 opacity-30"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M4 3h16v12h-6l-4 4v-4H4V3zm12 4h-2v4h2V7zm-6 0h2v4h-2V7z" />
              </svg>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 -bottom-6 -left-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl -z-10 blur-xl opacity-50"></div>
        </div>
      </div>
    </section>
  );
}
