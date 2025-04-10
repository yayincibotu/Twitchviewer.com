import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Users, BarChart2, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PricingSection from "@/components/sections/pricing-section";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch subscription status
  const { data: subscription, isLoading: loadingSubscription } = useQuery({
    queryKey: ['/api/subscription'],
    enabled: !!user,
  });
  
  // Check if user has an active subscription
  const hasSubscription = subscription?.hasSubscription;

  return (
    <>
      <Helmet>
        <title>Dashboard - TwitchViewer.com</title>
        <meta name="description" content="Manage your Twitch viewer services and track your growth." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Navbar />
        
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex flex-col items-start gap-6">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-neutral-800">Dashboard</h1>
              <p className="text-neutral-600">
                Welcome back, {user?.username}! Manage your services and track your growth.
              </p>
            </div>
            
            {/* Subscription Status Alert */}
            {loadingSubscription ? (
              <Card className="w-full">
                <CardContent className="py-4 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : !hasSubscription ? (
              <Card className="w-full border-amber-200 bg-amber-50">
                <CardContent className="py-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-amber-800">
                      You don't have an active subscription. Subscribe to a plan to start boosting your Twitch channel.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full border-green-200 bg-green-50">
                <CardContent className="py-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800">
                      Your subscription is active. Subscription ID: {subscription.subscriptionId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Dashboard Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:w-[400px]">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                {hasSubscription ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Current Viewers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">42</div>
                        <p className="text-xs text-neutral-500 mt-1">+12% from last stream</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Watch Time</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">267 hrs</div>
                        <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Follower Growth</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">+154</div>
                        <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Active Subscription</h3>
                    <p className="text-neutral-600 max-w-md mx-auto mb-6">
                      Subscribe to one of our plans to start growing your Twitch channel with real viewers.
                    </p>
                    <Button className="bg-primary hover:bg-primary-dark">View Plans</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="analytics" className="pt-6">
                {hasSubscription ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Viewer Statistics</CardTitle>
                        <CardDescription>Your viewer count over time</CardDescription>
                      </CardHeader>
                      <CardContent className="h-80 flex items-center justify-center">
                        <div className="text-center">
                          <BarChart2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                          <p className="text-neutral-600">Analytics dashboard will appear here</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                      <BarChart2 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Analytics Unavailable</h3>
                    <p className="text-neutral-600 max-w-md mx-auto mb-6">
                      Subscribe to access detailed analytics about your Twitch channel growth and viewer statistics.
                    </p>
                    <Button className="bg-primary hover:bg-primary-dark">View Plans</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Profile Information</h3>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-neutral-500">Username:</span>
                          <span className="col-span-2">{user?.username}</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-neutral-500">Email:</span>
                          <span className="col-span-2">{user?.email}</span>
                        </div>
                        <div className="grid grid-cols-3 text-sm">
                          <span className="text-neutral-500">Email verified:</span>
                          <span className="col-span-2">
                            {user?.emailVerified ? (
                              <span className="text-green-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            ) : (
                              <span className="text-amber-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Not verified
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Subscription</h3>
                      {hasSubscription ? (
                        <div className="text-sm">
                          <p className="text-green-600 mb-1">Active subscription</p>
                          <p className="text-neutral-600">ID: {subscription.subscriptionId}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-600">No active subscription</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline">Change Password</Button>
                    <Button className="bg-primary hover:bg-primary-dark">Update Profile</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
            
            {/* Display subscription plans if no active subscription */}
            {!hasSubscription && (
              <div className="w-full mt-8">
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">Choose a Subscription Plan</h2>
                <PricingSection simplified />
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
