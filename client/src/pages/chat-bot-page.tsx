import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Navbar } from "../components/layout/navbar";
import { LimitedTimeOfferBanner } from "../components/layout/limited-time-offer-banner";
import { Footer } from "../components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, MessageSquare, Users, Bot, Shield, Zap, BarChart3, Clock, CheckCircle, TrendingUp, Settings, MessageCircle, BrainCircuit, SlidersHorizontal } from "lucide-react";

export default function ChatBotPage() {
  const { toast } = useToast();
  
  // Fetch SEO settings for this page
  const { data: seoSettings } = useQuery({
    queryKey: ['/api/seo/chat-bot'],
    queryFn: async () => {
      const res = await fetch('/api/seo/chat-bot');
      return await res.json();
    }
  });

  // Analytics tracking
  useEffect(() => {
    // We would track page view here if we had an analytics service
    console.log('ChatBot page viewed');
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
        <title>{seoSettings?.title || "Twitch Chat Bot Service | Engage Your Stream Audience"}</title>
        <meta name="description" content={seoSettings?.description || "Premium Twitch chat bot service to enhance stream engagement. Customizable messages, moderation, interactive commands, and AI-powered responses."} />
        <meta name="keywords" content={`${seoSettings?.focusKeyword || "twitch chat bot"}, twitch chat, interactive commands, twitch moderation, ai chat bot, twitch engagement`} />
        <link rel="canonical" href="https://twitchviewer.com/chat-bot" />
        <meta property="og:title" content={seoSettings?.title || "Twitch Chat Bot Service | Engage Your Stream Audience"} />
        <meta property="og:description" content={seoSettings?.description || "Premium Twitch chat bot service to enhance stream engagement. Customizable messages, moderation, interactive commands, and AI-powered responses."} />
        <meta property="og:url" content="https://twitchviewer.com/chat-bot" />
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
                <span className="text-xs font-medium text-primary">Premium Chat Service</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Enhance Your <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Stream</span> with <br className="hidden md:block" />Interactive Chat Bots
              </h1>
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
                Our sophisticated chat bots increase audience engagement with customizable commands, 
                auto-responses, and AI-powered interactions that keep your viewers entertained.
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
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">50+</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-foreground/80">
                    Pre-built Command Templates
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="transform hover:scale-105 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 md:translate-y-4">
                <CardHeader className="pb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">99.9%</CardTitle>
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
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">2-4x</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-foreground/80">
                    Audience Engagement Boost
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
                Advanced <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Chat Bot</span> Features
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Everything you need to keep your viewers engaged and interacting with your stream
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Advanced Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Automatically detect and filter spam, inappropriate content, and unwanted messages to keep your chat clean and welcoming.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 2 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Custom Commands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create personalized commands that respond to viewer queries, share information, or trigger special effects on your stream.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 3 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>AI-Powered Responses</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Leverage advanced AI to generate contextual responses that interact naturally with your viewers even when you're focused on gameplay.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 4 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Scheduled Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Set up timed messages to remind viewers about subscriptions, social media, or upcoming events without manual intervention.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 5 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <SlidersHorizontal className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Interactive Mini-Games</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Engage your audience with built-in mini-games like trivia, polls, and prediction contests that keep viewers returning to your channel.
                  </p>
                </CardContent>
              </Card>
              
              {/* Feature 6 */}
              <Card className="border border-border/50 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Chat Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track viewer engagement, most used commands, peak chat times, and other insights to optimize your streaming strategy.
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
                How Our <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Chat Bot</span> Works
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                A simple three-step process to enhance your Twitch chat experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Channel</h3>
                <p className="text-muted-foreground">
                  Link our bot to your Twitch channel through a simple authorization process that takes less than a minute.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Customize Your Bot</h3>
                <p className="text-muted-foreground">
                  Choose from pre-built templates or create custom commands, auto-responses, and moderation rules through our user-friendly dashboard.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Watch Engagement Grow</h3>
                <p className="text-muted-foreground">
                  Enjoy increased chat activity and viewer retention as your audience interacts with your personalized chat bot.
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
                Choose Your <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Chat Bot</span> Plan
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Flexible options to match your streaming needs and budget
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Basic Plan */}
              <Card className="border border-border/50 relative overflow-hidden">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-bold">Starter</CardTitle>
                  <CardDescription>For new streamers</CardDescription>
                  <div className="mt-3 text-3xl font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>5 custom commands</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Basic chat moderation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Timed messages</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Email support</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 rounded-full">Select Plan</Button>
                </CardContent>
              </Card>
              
              {/* Pro Plan - Most Popular */}
              <Card className="border-primary relative overflow-hidden transform scale-105">
                <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center text-xs py-1 font-medium">MOST POPULAR</div>
                <CardHeader className="pb-2 pt-8">
                  <CardTitle className="text-xl font-bold">Professional</CardTitle>
                  <CardDescription>For growing channels</CardDescription>
                  <div className="mt-3 text-3xl font-bold">$24.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Unlimited custom commands</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced moderation with filters</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Chat mini-games and polls</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Basic AI chat responses</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 btn-gradient rounded-full">Select Plan</Button>
                </CardContent>
              </Card>
              
              {/* Enterprise Plan */}
              <Card className="border border-border/50 relative overflow-hidden">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl font-bold">Enterprise</CardTitle>
                  <CardDescription>For established streamers</CardDescription>
                  <div className="mt-3 text-3xl font-bold">$59.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                </CardHeader>
                <CardContent>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Everything in Professional</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Advanced AI-powered interactions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Custom viewer loyalty system</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Stream alerts integration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Dedicated account manager</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full mt-8 rounded-full">Select Plan</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-20 md:py-28 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                What Streamers Say About Our <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Chat Bot</span>
              </h2>
              <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                Success stories from streamers who've transformed their chat experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Testimonial 1 */}
              <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <span>StreamerPro92</span>
                  </CardTitle>
                  <CardDescription>Variety Streamer, 50K Followers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "The chat bot transformed my stream. Engagement is up 200%, and my viewers love the interactive mini-games. The moderation features have saved me from hiring extra mods."
                  </p>
                </CardContent>
              </Card>
              
              {/* Testimonial 2 */}
              <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <span>GamingQueen</span>
                  </CardTitle>
                  <CardDescription>FPS Gamer, 125K Followers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "I can finally focus on gameplay while my chat stays active and moderated. The AI responses are surprisingly natural, and my viewers often can't tell when it's the bot responding!"
                  </p>
                </CardContent>
              </Card>
              
              {/* Testimonial 3 */}
              <Card className="border-0 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <CardTitle className="flex items-center gap-2">
                    <span>CreativeBuilder</span>
                  </CardTitle>
                  <CardDescription>Art & Design Streamer, 78K Followers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "The scheduled messages feature helps keep my chat informed while I'm focused on creating. My viewer retention has doubled since adding this chat bot to my stream setup."
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIHN0cm9rZT0icmdiYSg3OSwgNzAsIDIyOSwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIiBjeD0iNzIwIiBjeT0iMjUwIiByPSIyMDAiLz48Y2lyY2xlIHN0cm9rZT0icmdiYSg3OSwgNzAsIDIyOSwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIiBjeD0iNzIwIiBjeT0iMjUwIiByPSIxNTAiLz48Y2lyY2xlIHN0cm9rZT0icmdiYSg3OSwgNzAsIDIyOSwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIiBjeD0iNzIwIiBjeT0iMjUwIiByPSIxMDAiLz48Y2lyY2xlIHN0cm9rZT0icmdiYSg3OSwgNzAsIDIyOSwgMC4yKSIgc3Ryb2tlLXdpZHRoPSIxIiBjeD0iNzIwIiBjeT0iMjUwIiByPSI1MCIvPjwvZz48L3N2Zz4=')] bg-no-repeat bg-top" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/80 to-purple-600/80 rounded-3xl p-8 md:p-12 shadow-xl backdrop-blur-sm">
              <div className="text-center text-white">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                  Ready to Transform Your Stream?
                </h2>
                <p className="mx-auto max-w-xl text-lg opacity-90 mb-8">
                  Join thousands of successful streamers using our chat bot to grow their audience and enhance viewer engagement.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="rounded-full px-8 bg-white text-primary hover:bg-white/90">
                    Get Started Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white text-white hover:bg-white/10"
                  >
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </div>
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
                Everything you need to know about our chat bot service
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto divide-y divide-border">
              {/* FAQ Item 1 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Is the chat bot compliant with Twitch's TOS?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Yes, our chat bot is fully compliant with Twitch's Terms of Service. We designed it to enhance the platform experience without breaking any rules. The bot operates as a proper chat participant with your authorization.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 2 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Can I customize the bot's name and avatar?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Professional and Enterprise plans allow full customization of your bot's name and profile picture. On the Starter plan, you can customize the name but use one of our pre-made avatars.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 3 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">How does the AI response feature work?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Our AI system analyzes chat context and responds naturally to viewer questions or comments. You can set topics it should know about, train it with your preferred responses, and customize its personality to match your stream's vibe.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 4 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Can I try before subscribing?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Absolutely! We offer a 7-day free trial with all features enabled so you can experience the full potential of our chat bot before making a commitment.
                  </p>
                </details>
              </div>
              
              {/* FAQ Item 5 */}
              <div className="py-5">
                <details className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                    <span className="text-lg font-semibold">Can I switch plans later?</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24">
                        <path d="M6 9l6 6 6-6"></path>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-3 group-open:animate-fadeIn">
                    Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades will apply at the start of your next billing cycle.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </>
  );
}