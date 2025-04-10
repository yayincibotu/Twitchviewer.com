import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, PackagePlus, Globe, Settings2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertSeoSettingsSchema, insertPackageSchema } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("packages");
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  
  // Fetch packages
  const { data: packages, isLoading: loadingPackages } = useQuery({
    queryKey: ['/api/packages'],
  });
  
  // Fetch SEO settings
  const { data: seoSettings, isLoading: loadingSeo } = useQuery({
    queryKey: ['/api/seo'],
  });
  
  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertPackageSchema>) => {
      const res = await apiRequest("POST", "/api/packages", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "Package created",
        description: "The new package has been created successfully.",
      });
      setIsPackageDialogOpen(false);
      packageForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create package",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create SEO settings mutation
  const createSeoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertSeoSettingsSchema>) => {
      const res = await apiRequest("POST", "/api/seo", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/seo'] });
      toast({
        title: "SEO settings created",
        description: "The new SEO settings have been created successfully.",
      });
      setIsSeoDialogOpen(false);
      seoForm.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create SEO settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Package form
  const packageForm = useForm<z.infer<typeof insertPackageSchema>>({
    resolver: zodResolver(insertPackageSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      maxViewers: 0,
      features: [],
      stripePriceId: "",
    },
  });
  
  // SEO settings form
  const seoForm = useForm<z.infer<typeof insertSeoSettingsSchema>>({
    resolver: zodResolver(insertSeoSettingsSchema),
    defaultValues: {
      pageSlug: "",
      title: "",
      description: "",
      focusKeyword: "",
      cornerstoneContent: false,
    },
  });
  
  function onPackageSubmit(values: z.infer<typeof insertPackageSchema>) {
    // Convert features string to array if needed
    const featuresList = Array.isArray(values.features) 
      ? values.features 
      : values.features.split(',').map(f => f.trim());
    
    createPackageMutation.mutate({
      ...values,
      features: featuresList,
    });
  }
  
  function onSeoSubmit(values: z.infer<typeof insertSeoSettingsSchema>) {
    createSeoMutation.mutate(values);
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - TwitchViewer.com</title>
        <meta name="description" content="Admin dashboard for TwitchViewer.com" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-neutral-100">
        <Navbar />
        
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="flex flex-col items-start gap-6">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
              <p className="text-neutral-600">
                Manage packages, users, and site settings.
              </p>
            </div>
            
            {/* Admin Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 md:w-[400px]">
                <TabsTrigger value="packages">Packages</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              {/* Packages Tab */}
              <TabsContent value="packages" className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Manage Packages</h2>
                  <Dialog open={isPackageDialogOpen} onOpenChange={setIsPackageDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary-dark">
                        <PackagePlus className="h-4 w-4 mr-2" />
                        Add Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Create New Package</DialogTitle>
                        <DialogDescription>
                          Add a new subscription package for users.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...packageForm}>
                        <form onSubmit={packageForm.handleSubmit(onPackageSubmit)} className="space-y-4">
                          <FormField
                            control={packageForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Package Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Starter, Professional, Enterprise" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={packageForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Package description" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={packageForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (in cents)</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g. 1900 for $19.00" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={packageForm.control}
                              name="maxViewers"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Max Viewers</FormLabel>
                                  <FormControl>
                                    <Input type="number" placeholder="e.g. 50, 200, 500" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={packageForm.control}
                            name="features"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Features (comma separated)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="e.g. Up to 50 Viewers, Basic Analytics, Email Support" 
                                    {...field} 
                                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value} 
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={packageForm.control}
                            name="stripePriceId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Stripe Price ID</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. price_1234" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={createPackageMutation.isPending}>
                              {createPackageMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Create Package
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {loadingPackages ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : packages && packages.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                      <Card key={pkg.id}>
                        <CardHeader>
                          <CardTitle>{pkg.name}</CardTitle>
                          <CardDescription>{pkg.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-neutral-500">Price:</span>
                              <span className="text-sm">${(pkg.price / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-neutral-500">Max Viewers:</span>
                              <span className="text-sm">{pkg.maxViewers}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium text-neutral-500">Stripe Price ID:</span>
                              <span className="text-sm">{pkg.stripePriceId}</span>
                            </div>
                            <div className="pt-2">
                              <span className="text-sm font-medium text-neutral-500">Features:</span>
                              <ul className="mt-1 space-y-1">
                                {pkg.features.map((feature, index) => (
                                  <li key={index} className="text-sm flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-1 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                      <PackagePlus className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Packages Found</h3>
                    <p className="text-neutral-600 max-w-md mx-auto mb-6">
                      Create subscription packages to offer your services to users.
                    </p>
                  </div>
                )}
              </TabsContent>
              
              {/* SEO Tab */}
              <TabsContent value="seo" className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">SEO Settings</h2>
                  <Dialog open={isSeoDialogOpen} onOpenChange={setIsSeoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary-dark">
                        <Globe className="h-4 w-4 mr-2" />
                        Add SEO Settings
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                        <DialogTitle>Create SEO Settings</DialogTitle>
                        <DialogDescription>
                          Add SEO settings for a page on the website.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...seoForm}>
                        <form onSubmit={seoForm.handleSubmit(onSeoSubmit)} className="space-y-4">
                          <FormField
                            control={seoForm.control}
                            name="pageSlug"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Page Slug</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. home, features, pricing" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={seoForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SEO Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="Page title for search engines" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={seoForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SEO Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Meta description for search engines" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={seoForm.control}
                            name="focusKeyword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Focus Keyword</FormLabel>
                                <FormControl>
                                  <Input placeholder="Main keywords for this page" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={seoForm.control}
                            name="cornerstoneContent"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                  <FormLabel>Cornerstone Content</FormLabel>
                                  <FormDescription>
                                    Mark this page as important cornerstone content.
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button type="submit" className="bg-primary hover:bg-primary-dark" disabled={createSeoMutation.isPending}>
                              {createSeoMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              ) : null}
                              Save SEO Settings
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
                
                {loadingSeo ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : seoSettings && seoSettings.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {seoSettings.map((seo) => (
                      <Card key={seo.id}>
                        <CardHeader>
                          <CardTitle>/{seo.pageSlug}</CardTitle>
                          <CardDescription>SEO settings for {seo.pageSlug} page</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-medium text-neutral-500">Title:</span>
                              <p className="text-sm mt-1">{seo.title}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-neutral-500">Description:</span>
                              <p className="text-sm mt-1">{seo.description}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-neutral-500">Focus Keyword:</span>
                              <p className="text-sm mt-1">{seo.focusKeyword}</p>
                            </div>
                            <div className="flex items-center pt-1">
                              <span className="text-sm font-medium text-neutral-500 mr-2">Cornerstone Content:</span>
                              {seo.cornerstoneContent ? (
                                <span className="text-sm text-green-600 flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Yes
                                </span>
                              ) : (
                                <span className="text-sm text-neutral-500">No</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No SEO Settings Found</h3>
                    <p className="text-neutral-600 max-w-md mx-auto mb-6">
                      Create SEO settings for each page to improve search engine visibility.
                    </p>
                  </div>
                )}
                
                <div className="mt-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>XML Sitemap</CardTitle>
                      <CardDescription>Automatically generated XML sitemap for search engines</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-neutral-600">
                        Your sitemap is available at the URL below. It includes all pages with SEO settings and is automatically updated when you add new pages.
                      </p>
                      <div className="flex items-center">
                        <code className="bg-neutral-800 text-white py-2 px-4 rounded text-sm flex-grow overflow-x-auto">
                          {window.location.origin}/sitemap.xml
                        </code>
                        <Button 
                          variant="outline" 
                          className="ml-2 whitespace-nowrap"
                          onClick={() => {
                            window.open(`${window.location.origin}/sitemap.xml`, '_blank');
                          }}
                        >
                          View Sitemap
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Settings Tab */}
              <TabsContent value="settings" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Site Settings</CardTitle>
                    <CardDescription>Manage general website settings</CardDescription>
                  </CardHeader>
                  <CardContent className="h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Settings2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-600">Additional settings will appear here in future updates</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
