import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Navbar from "../components/layout/navbar";
import LimitedTimeOfferBanner from "../components/sections/limited-time-offer-banner";
import Footer from "../components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, Users, UserPlus, Heart, Shield, Zap, BarChart3, 
  Clock, CheckCircle, TrendingUp, Badge, Settings, LineChart 
} from "lucide-react";

export default function FollowBotPage() {
  const { toast } = useToast();
  
  // Fetch SEO settings for this page
  const { data: seoSettings } = useQuery({
    queryKey: ['/api/seo/follow-bot'],
    queryFn: async () => {
      const res = await fetch('/api/seo/follow-bot');
      return await res.json();
    }
  });

  // Analytics tracking
  useEffect(() => {
    // We would track page view here if we had an analytics service
    console.log('FollowBot page viewed');
  }, []);

  const handleFreeTrialClick = () => {
    toast({
      title: "Free trial activated!",
      description: "Check your email for next steps.",
      variant: "default",
    });
  };

  return (
    <>
      <Helmet>
        <title>{seoSettings?.title || "Twitch Follow Bot Service | Grow Your Follower Count"}</title>
        <meta name="description" content={seoSettings?.description || "Premium Twitch follow bot service to rapidly increase your follower count. Organic-looking followers, customizable growth rates, and comprehensive analytics."} />
        <meta name="keywords" content={`${seoSettings?.focusKeyword || "twitch follow bot"}, twitch followers, gain twitch followers, twitch growth, organic twitch followers, boost twitch channel`} />
        <link rel="canonical" href="https://twitchviewer.com/follow-bot" />
        <meta property="og:title" content={seoSettings?.title || "Twitch Follow Bot Service | Grow Your Follower Count"} />
        <meta property="og:description" content={seoSettings?.description || "Premium Twitch follow bot service to rapidly increase your follower count. Organic-looking followers, customizable growth rates, and comprehensive analytics."} />
        <meta property="og:url" content="https://twitchviewer.com/follow-bot" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <LimitedTimeOfferBanner />
        
        {/* Hero Section with an alternative design - darker with more striking gradients */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 py-20 md:py-28 text-white">
          {/* Animated particle effect background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/2 right-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-purple-300/30 bg-purple-500/20 px-4 py-1.5 mb-5">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-purple-200" />
                <span className="text-xs font-medium text-purple-100">Elite Follow Service</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                Accelerate Your <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Growth</span> with <br className="hidden md:block" />Authentic Followers
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-purple-100/90">
                Our advanced follower technology delivers natural-looking channel growth 
                with real-time analytics and customizable growth patterns that evade detection systems.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 border-0">
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-purple-300/50 bg-transparent hover:bg-purple-500/20 text-white"
                  onClick={handleFreeTrialClick}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
            
            {/* Floating stats cards with altered design */}
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-xl bg-indigo-900/60 backdrop-blur-sm text-white">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center mb-3">
                    <UserPlus className="h-5 w-5 text-purple-200" />
                  </div>
                  <CardTitle className="text-2xl">10K+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-purple-100/80">
                    High-Quality Followers
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-xl bg-indigo-900/60 backdrop-blur-sm text-white md:translate-y-4">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-purple-200" />
                  </div>
                  <CardTitle className="text-2xl">99.8%</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-purple-100/80">
                    Retention Rate
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-xl bg-indigo-900/60 backdrop-blur-sm text-white">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-purple-500/30 flex items-center justify-center mb-3">
                    <TrendingUp className="h-5 w-5 text-purple-200" />
                  </div>
                  <CardTitle className="text-2xl">5-10x</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-purple-100/80">
                    Discovery Boost
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section - With unique hexagonal layout */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Why <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Followers</span> Matter
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                More followers unlock platform benefits and boost your discovery rate
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-5">
                  <Badge className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Affiliate Status</h3>
                <p className="text-muted-foreground">
                  Reach the follower requirements for Twitch Affiliate faster, enabling monetization through subscriptions and bits.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-5">
                  <LineChart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Social Proof</h3>
                <p className="text-muted-foreground">
                  Higher follower counts create perceived popularity, encouraging more organic viewers to follow and engage with your content.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-5">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Improved Discovery</h3>
                <p className="text-muted-foreground">
                  Twitch algorithms favor channels with higher follower counts when recommending streams to potential new viewers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Advanced <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Follow Bot</span> Features
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                State-of-the-art technology designed to maximize your channel growth safely
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <Card className="bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 border-t-4 border-t-pink-500">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-pink-500" />
                  </div>
                  <CardTitle>Anti-Detection Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our followers utilize advanced proxies and behavior patterns that appear completely organic to Twitch's detection systems.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 2 */}
              <Card className="bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 border-t-4 border-t-purple-500">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>Natural Growth Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Customize delivery rates to mimic natural growth - from gradual increases to strategic bursts that coincide with your content releases.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 3 */}
              <Card className="bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 border-t-4 border-t-indigo-500">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-indigo-500" />
                  </div>
                  <CardTitle>Detailed Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your growth with real-time dashboard showing follower acquisition rates, retention statistics, and demographic insights.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 4 */}
              <Card className="bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>Scheduled Deliveries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Plan your growth with scheduled follower deliveries to align perfectly with your streaming calendar and content releases.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 5 */}
              <Card className="bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 border-t-4 border-t-cyan-500">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <Settings className="h-6 w-6 text-cyan-500" />
                  </div>
                  <CardTitle>Profile Customization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Select from various follower profile types to match your target audience demographics and create an authentic community appearance.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 6 */}
              <Card className="bg-white dark:bg-slate-800 hover:shadow-lg transition-all duration-300 border-t-4 border-t-pink-500">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-pink-500" />
                  </div>
                  <CardTitle>Accounts With History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our follower accounts have established watch histories and platform activity, making them indistinguishable from genuine Twitch users.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section - With vertical timeline design */}
        <section className="bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 py-20 md:py-28 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                How Our <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Follow Bot</span> Works
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                A simple three-step process to skyrocket your follower count
              </p>
            </div>
            
            <div className="relative">
              {/* Vertical line for timeline effect */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-500 to-purple-600 hidden md:block"></div>
              
              <div className="space-y-16">
                {/* Step 1 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Create Your Growth Plan</h3>
                    <p className="text-muted-foreground">
                      Tell us your goals and select your desired follower count and growth rate. 
                      Our experts will help customize a delivery schedule that looks completely natural.
                    </p>
                  </div>
                  <div className="md:w-12 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold z-10">1</div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 hidden md:block"></div>
                  <div className="md:w-12 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold z-10">2</div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 md:text-left mt-8 md:mt-0">
                    <h3 className="text-2xl font-bold mb-2">Activate Your Campaign</h3>
                    <p className="text-muted-foreground">
                      Enter your Twitch username or channel URL in our secure dashboard. 
                      No passwords or account access needed - we work exclusively through Twitch's public API.
                    </p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2">Watch Your Channel Grow</h3>
                    <p className="text-muted-foreground">
                      Monitor real-time results through our analytics dashboard as new followers 
                      join your channel according to your customized delivery schedule.
                    </p>
                  </div>
                  <div className="md:w-12 flex justify-center">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold z-10">3</div>
                  </div>
                  <div className="md:w-1/2 md:pl-12 hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Service Plans Section - With eye-catching design */}
        <section className="py-20 md:py-28 relative">
          <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Choose Your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Growth</span> Plan
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Flexible options to match your channel growth goals
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <Card className="relative overflow-hidden border-t-4 border-t-pink-400 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 w-28 h-28 bg-gradient-to-r from-pink-400 to-pink-500"></div>
                </div>
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-bold">Starter Growth</CardTitle>
                  <CardDescription>For new streamers</CardDescription>
                  <div className="mt-3 text-3xl font-bold">$14.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2 shrink-0 mt-0.5" />
                      <span>500 followers per month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2 shrink-0 mt-0.5" />
                      <span>Standard delivery schedule</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2 shrink-0 mt-0.5" />
                      <span>Basic analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-pink-500 mr-2 shrink-0 mt-0.5" />
                      <span>Email support</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">Select Plan</Button>
                </CardContent>
              </Card>
              
              {/* Pro Plan - Most Popular */}
              <Card className="relative overflow-hidden transform scale-105 border-t-4 border-t-purple-500 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-center text-xs py-1 font-medium">MOST POPULAR</div>
                <CardHeader className="pb-2 pt-8">
                  <CardTitle className="text-xl font-bold">Advanced Growth</CardTitle>
                  <CardDescription>For serious streamers</CardDescription>
                  <div className="mt-3 text-3xl font-bold">$29.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                      <span>2,000 followers per month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                      <span>Customizable delivery schedule</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced analytics dashboard</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                      <span>Profile type selection</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-full">Select Plan</Button>
                </CardContent>
              </Card>
              
              {/* Enterprise Plan */}
              <Card className="relative overflow-hidden border-t-4 border-t-indigo-400 shadow-lg">
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[50%] rotate-45 w-28 h-28 bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
                </div>
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-bold">Elite Growth</CardTitle>
                  <CardDescription>For professional streamers</CardDescription>
                  <div className="mt-3 text-3xl font-bold">$69.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>5,000+ followers per month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>Fully customizable delivery</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>Premium active followers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>Comprehensive analytics suite</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">Select Plan</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white relative overflow-hidden">
          {/* Animated particle effect background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/2 right-1/3 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Start Growing Your Channel Today
              </h2>
              <p className="mx-auto max-w-xl text-lg opacity-90 mb-8">
                Join thousands of successful streamers who've accelerated their Twitch career with our premium follower service.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 bg-white text-purple-900 hover:bg-white/90">
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white text-white hover:bg-white/10"
                >
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Frequently Asked <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Everything you need to know about our follow bot service
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-border">
              {/* FAQ Item 1 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Is using a follow bot against Twitch's TOS?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Our service utilizes advanced techniques that mimic natural follower acquisition patterns. While automated services can be against platform rules, our system is designed to be indistinguishable from organic growth when used responsibly within our recommended guidelines.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Will these followers actually watch my streams?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Our follower service focuses specifically on increasing your follower count. For active viewers during your streams, please check our Viewer Bot service, which provides authentic-looking viewers who contribute to your view count and stream metrics.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">How quickly will I see results?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    You'll start seeing followers added to your account within 24 hours of activating your service. However, we recommend our natural growth pattern which gradually increases followers over time to maintain authenticity. For urgent needs, our Express delivery option is available on Advanced and Elite plans.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Will these followers unfollow later?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    We maintain an industry-leading 99.8% retention rate on all followers. If you ever experience follower drop-off exceeding our guaranteed 0.2% monthly rate, we'll replace them at no additional cost as part of our retention guarantee.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Do you need my account password?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Absolutely not. We never request or require your Twitch password or any account credentials. Our service works entirely through Twitch's public API and only requires your channel name or URL, which is already publicly available information.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
      
      {/* Styles implemented in index.css */}
    </>
  );
}