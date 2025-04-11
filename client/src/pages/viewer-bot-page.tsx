import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, TrendingUp, Shield, Zap, BarChart3, Clock, CheckCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import LimitedTimeOfferBanner from '@/components/sections/limited-time-offer-banner';

export default function ViewerBotPage() {
  const { toast } = useToast();
  
  // Fetch SEO settings for this page
  const { data: seoSettings } = useQuery({
    queryKey: ['/api/seo/viewer-bot'],
    queryFn: async () => {
      const res = await fetch('/api/seo/viewer-bot');
      if (!res.ok) return {
        title: "Twitch Viewer Bot Service | Boost Your Stream Views",
        description: "Premium Twitch viewer bot service to boost your stream views. Real-looking viewers, analytics, and 24/7 support. Start growing your channel today!",
        focusKeyword: "twitch viewer bot",
      };
      return await res.json();
    }
  });

  // Analytics tracking
  useEffect(() => {
    // We would track page view here if we had an analytics service
    console.log('ViewerBot page viewed');
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
        <title>{seoSettings?.title || "Twitch Viewer Bot Service | Boost Your Stream Views"}</title>
        <meta name="description" content={seoSettings?.description || "Premium Twitch viewer bot service to boost your stream views. Real-looking viewers, analytics, and 24/7 support. Start growing your channel today!"} />
        <meta name="keywords" content={`${seoSettings?.focusKeyword || "twitch viewer bot"}, twitch viewers, boost stream viewers, twitch growth, stream viewers, twitch promotion`} />
        <link rel="canonical" href="https://twitchviewer.com/viewer-bot" />
        <meta property="og:title" content={seoSettings?.title || "Twitch Viewer Bot Service | Boost Your Stream Views"} />
        <meta property="og:description" content={seoSettings?.description || "Premium Twitch viewer bot service to boost your stream views. Real-looking viewers, analytics, and 24/7 support. Start growing your channel today!"} />
        <meta property="og:url" content="https://twitchviewer.com/viewer-bot" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <Navbar />
        <LimitedTimeOfferBanner />
        
        {/* Hero Section with Gradient Background */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 py-20 md:py-28">
          <div className="absolute inset-0 z-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSJ0cmFuc3BhcmVudCIgd2lkdGg9IjE0NDAiIGhlaWdodD0iNzYwIi8+PGNpcmNsZSBzdHJva2U9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4MCIgcj0iMzAwIi8+PGNpcmNsZSBzdHJva2U9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4MCIgcj0iMjUwIi8+PGNpcmNsZSBzdHJva2U9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4MCIgcj0iMjAwIi8+PGNpcmNsZSBzdHJva2U9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4MCIgcj0iMTUwIi8+PGNpcmNsZSBzdHJva2U9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4MCIgcj0iMTAwIi8+PGNpcmNsZSBzdHJva2U9InJnYmEoNzksIDcwLCAyMjksIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIgY3g9IjcyMCIgY3k9IjM4MCIgcj0iNTAiLz48Y2lyY2xlIHN0cm9rZT0icmdiYSg3OSwgNzAsIDIyOSwgMC4xKSIgc3Ryb2tlLXdpZHRoPSIyIiBjeD0iNzIwIiBjeT0iMzgwIiByPSI1MCIvPjwvZz48L3N2Zz4=')]" />
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-5">
                <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Premium Viewer Service</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Elevate Your <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Stream</span> with <br className="hidden md:block" />Real-Looking Viewers
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Our intelligent viewer bots simulate authentic audience behavior to help you break through
                the Twitch algorithm and gain more organic viewers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 btn-gradient">
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-foreground"
                  onClick={handleFreeTrialClick}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
            
            {/* Floating stats cards with subtle animations */}
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">15,000+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-foreground/80">
                    Active Viewers Ready
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 md:translate-y-4">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">98.7%</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-foreground/80">
                    Uptime Guarantee
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">3-5x</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-foreground/80">
                    Organic Growth Boost
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Advanced <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Viewer Bot</span> Features
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Everything you need to grow your Twitch channel strategically and naturally
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Undetectable Proxies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our viewer bots use high-quality residential and mobile proxies to appear completely organic to Twitch's detection systems.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 2 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Instant Scaling</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Scale from 10 to 10,000 viewers instantly or choose gradual growth that mimics natural audience building.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 3 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Detailed Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your growth with comprehensive analytics showing viewer counts, retention rates, and algorithm improvements.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 4 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>24/7 Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our service never sleeps. Schedule viewers for any time, any day, without interruptions or downtime.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 5 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Natural Viewer Behavior</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our bots simulate real viewer behavior with random watch times, periodic chat activity, and normal interaction patterns.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 6 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Category Ranking Boost</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Rise in the Twitch category rankings to attract more organic viewers through improved visibility.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                How Our <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Viewer Bot</span> Works
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                A simple three-step process to boost your Twitch presence
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Create Your Account</h3>
                <p className="text-muted-foreground">
                  Sign up and verify your account in less than 2 minutes. No complex verification processes.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Configure Your Service</h3>
                <p className="text-muted-foreground">
                  Enter your Twitch channel URL, select your viewer count, and customize viewer behavior settings.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Watch Your Channel Grow</h3>
                <p className="text-muted-foreground">
                  Our viewers join your stream almost instantly. Monitor your growth through our real-time dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Service Plans Section */}
        <section className="py-20 md:py-28 relative">
          <div className="absolute inset-0 z-0 opacity-30 dark:opacity-20">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Choose Your <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Viewer</span> Plan
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Flexible plans designed to match your streaming needs and goals
              </p>
            </div>

            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-64 grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (20% off)</TabsTrigger>
                </TabsList>
              </div>
            
              <TabsContent value="monthly">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Basic Plan */}
                  <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle>Starter Pack</CardTitle>
                      <div className="mt-4 flex items-baseline text-foreground">
                        <span className="text-4xl font-extrabold tracking-tight">$49</span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Up to 100 concurrent viewers</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Realistic viewer behavior</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Basic analytics dashboard</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Email support</span>
                        </li>
                      </ul>
                      <Button className="mt-6 w-full rounded-lg">Get Started</Button>
                    </CardContent>
                  </Card>
                  
                  {/* Pro Plan */}
                  <Card className="border-primary relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                      <div className="bg-primary px-4 py-1 text-xs font-semibold uppercase text-white shadow-lg">
                        Popular
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>Growth Pack</CardTitle>
                      <div className="mt-4 flex items-baseline text-foreground">
                        <span className="text-4xl font-extrabold tracking-tight">$99</span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Up to 500 concurrent viewers</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Enhanced viewer behavior</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Priority email support</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Chat activity simulation</span>
                        </li>
                      </ul>
                      <Button className="mt-6 w-full rounded-lg btn-gradient">Get Started</Button>
                    </CardContent>
                  </Card>
                  
                  {/* Enterprise Plan */}
                  <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle>Elite Pack</CardTitle>
                      <div className="mt-4 flex items-baseline text-foreground">
                        <span className="text-4xl font-extrabold tracking-tight">$249</span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Up to 2,000 concurrent viewers</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Premium viewer behavior</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Comprehensive analytics</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>24/7 priority support</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Advanced chat interaction</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Channel growth consultation</span>
                        </li>
                      </ul>
                      <Button className="mt-6 w-full rounded-lg">Get Started</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="yearly">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Basic Plan Yearly */}
                  <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle>Starter Pack</CardTitle>
                      <div className="mt-4 flex items-baseline text-foreground">
                        <span className="text-4xl font-extrabold tracking-tight">$39</span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Billed annually ($468)</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Up to 100 concurrent viewers</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Realistic viewer behavior</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Basic analytics dashboard</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Email support</span>
                        </li>
                      </ul>
                      <Button className="mt-6 w-full rounded-lg">Get Started</Button>
                    </CardContent>
                  </Card>
                  
                  {/* Pro Plan Yearly */}
                  <Card className="border-primary relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 transform">
                      <div className="bg-primary px-4 py-1 text-xs font-semibold uppercase text-white shadow-lg">
                        Popular
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle>Growth Pack</CardTitle>
                      <div className="mt-4 flex items-baseline text-foreground">
                        <span className="text-4xl font-extrabold tracking-tight">$79</span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Billed annually ($948)</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Up to 500 concurrent viewers</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Enhanced viewer behavior</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Priority email support</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Chat activity simulation</span>
                        </li>
                      </ul>
                      <Button className="mt-6 w-full rounded-lg btn-gradient">Get Started</Button>
                    </CardContent>
                  </Card>
                  
                  {/* Enterprise Plan Yearly */}
                  <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <CardTitle>Elite Pack</CardTitle>
                      <div className="mt-4 flex items-baseline text-foreground">
                        <span className="text-4xl font-extrabold tracking-tight">$199</span>
                        <span className="ml-1 text-xl font-semibold">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">Billed annually ($2,388)</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Up to 2,000 concurrent viewers</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Premium viewer behavior</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Comprehensive analytics</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>24/7 priority support</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Advanced chat interaction</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-primary mr-2" />
                          <span>Channel growth consultation</span>
                        </li>
                      </ul>
                      <Button className="mt-6 w-full rounded-lg">Get Started</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="bg-slate-50 dark:bg-slate-900/50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Frequently Asked <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Everything you need to know about our Twitch viewer bot service
              </p>
            </div>
            
            <div className="mx-auto max-w-3xl">
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Is using a viewer bot against Twitch's terms of service?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Our service is designed to help you get initial visibility. We recommend using our service responsibly as a temporary boost while you develop your organic content strategy. Always prioritize building genuine engagement with real viewers.
                    </p>
                  </CardContent>
                </Card>
                
                {/* FAQ Item 2 */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">How soon will I see results after using your service?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      You'll see an immediate increase in your viewer count within minutes of activating our service. The organic growth effects typically begin to show after 2-3 weeks of consistent use as the Twitch algorithm starts to recognize your channel's increased popularity.
                    </p>
                  </CardContent>
                </Card>
                
                {/* FAQ Item 3 */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Will these viewers interact with my stream?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Depending on your selected plan, our viewers can simulate basic chat interactions. Our Growth and Elite packages include chat activity simulation to make the viewing experience appear more authentic. However, meaningful engagement will come from the real viewers you attract through increased visibility.
                    </p>
                  </CardContent>
                </Card>
                
                {/* FAQ Item 4 */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Can I customize when the viewers join my stream?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes! You can schedule exactly when viewers join your stream through our dashboard. You can set up recurring schedules, one-time boosts, or gradual viewer increases that mimic natural growth patterns for maximum authenticity.
                    </p>
                  </CardContent>
                </Card>
                
                {/* FAQ Item 5 */}
                <Card className="border border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Do you offer a money-back guarantee?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, we offer a 7-day money-back guarantee if you're not satisfied with our service. We're confident in the quality of our viewer bots and their ability to help boost your channel's visibility.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
          <div className="absolute inset-0 z-0 opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#smallGrid)" />
            </svg>
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Grow</span> Your Twitch Channel?
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground mb-8">
                Join thousands of streamers who have used our service to boost their visibility, gain more followers, and reach their streaming goals.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 btn-gradient">
                  Get Started Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 text-foreground"
                  onClick={handleFreeTrialClick}
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}