import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, registerSchema, passwordResetRequestSchema, resetPasswordSchema } from "@/hooks/use-auth";
import { Loader2, ArrowLeft, Check, LucideRocket } from "lucide-react";
import { BasicTurnstile } from "@/components/ui/basic-turnstile";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SiTwitch } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";



const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
  turnstileToken: z.string().min(1, "Please complete the Turnstile verification"),
});

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    user, 
    loginMutation, 
    registerMutation, 
    requestPasswordResetMutation, 
    resetPasswordMutation,
    updateRememberSessionMutation 
  } = useAuth();
  

  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);
  
  // Extract token from URL if present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
      setShowPasswordReset(true);
      setActiveTab("reset");
    }
  }, []);
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
      turnstileToken: "",
    },
  });
  
  // Register form
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      turnstileToken: "",
    },
  });
  
  // Password reset request form
  const resetRequestForm = useForm<z.infer<typeof passwordResetRequestSchema>>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: {
      email: "",
      turnstileToken: "",
    },
  });
  
  // Password reset form (with token)
  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: resetToken,
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Update reset token in the form when it changes
  useEffect(() => {
    resetPasswordForm.setValue("token", resetToken);
  }, [resetToken, resetPasswordForm]);
  
  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {      
      loginMutation.mutate(values);
      
      // If remember me is checked, update the session
      if (values.remember) {
        updateRememberSessionMutation.mutate({ remember: true });
      }
    } catch (error) {
      console.error("Login submission failed", error);
    }
  }
  
  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      registerMutation.mutate(values);
    } catch (error) {
      console.error("Registration submission failed", error);
    }
  }
  
  async function onResetRequestSubmit(values: z.infer<typeof passwordResetRequestSchema>) {
    try {
      requestPasswordResetMutation.mutate(values);
    } catch (error) {
      console.error("Password reset request failed", error);
    }
  }
  
  function onPasswordResetSubmit(values: z.infer<typeof resetPasswordSchema>) {
    resetPasswordMutation.mutate(values, {
      onSuccess: () => {
        // Reset the form and go back to login page
        resetPasswordForm.reset();
        setShowPasswordReset(false);
        setActiveTab("login");
      }
    });
  }
  
  // If already logged in, don't show the auth page
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Sign In or Sign Up - TwitchViewer.com</title>
        <meta name="description" content="Sign in to your TwitchViewer account or create a new account to boost your Twitch channel with real viewers." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950">
        <Navbar />
        
        <div className="flex-grow flex items-center justify-center py-12">
          <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 px-4">
            
            {/* Auth Form */}
            <div className="w-full lg:w-1/2 max-w-md mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                  <TabsTrigger value="reset" disabled={!showPasswordReset && activeTab !== "forgot"}>
                    Reset
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Card className="shadow-lg dark:shadow-purple-900/10">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg">
                      <CardTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">Sign In to TwitchViewer</CardTitle>
                      <CardDescription>
                        Enter your details to access your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Your password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FormField
                                control={loginForm.control}
                                name="remember"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                    <FormControl>
                                      <Checkbox 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                    <Label
                                      htmlFor="remember"
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      Remember me
                                    </Label>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => setActiveTab("forgot")}
                              className="text-sm text-indigo-600 hover:underline"
                            >
                              Forgot password?
                            </button>
                          </div>
                          
                          <FormField
                            control={loginForm.control}
                            name="turnstileToken"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Security Verification</FormLabel>
                                <FormControl>
                                  <div>
                                    <BasicTurnstile
                                      onVerify={(token: string) => {
                                        console.log("Turnstile login verification success, token length:", token?.length || 0);
                                        field.onChange(token);
                                      }}
                                      onExpire={() => {
                                        console.log("Turnstile login token expired");
                                        field.onChange("");
                                      }}
                                      onError={(error: string) => {
                                        console.error("Turnstile login error:", error);
                                        field.onChange("");
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-md transition-all"
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Sign In
                          </Button>
                        </form>
                      </Form>
                      
                      <div className="mt-8">
                        <Separator className="flex items-center justify-center">
                          <span className="px-4 text-xs text-gray-500 bg-white dark:bg-zinc-900">OR</span>
                        </Separator>
                        
                        <div className="mt-6">
                          <a
                            href="/api/auth/twitch"
                            className="flex items-center justify-center gap-2 w-full text-white bg-[#6441a5] hover:bg-[#7d5bbe] font-medium py-3 px-4 rounded-md transition-colors"
                          >
                            <SiTwitch className="h-5 w-5" />
                            <span>Continue with Twitch</span>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 bg-gray-50 dark:bg-zinc-900/50 rounded-b-lg">
                      <div className="text-sm text-neutral-500">
                        Don't have an account?{" "}
                        <button 
                          onClick={() => setActiveTab("register")}
                          className="text-indigo-600 hover:underline"
                        >
                          Sign up here
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="register">
                  <Card className="shadow-lg dark:shadow-purple-900/10">
                    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg">
                      <CardTitle className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">Create an Account</CardTitle>
                      <CardDescription>
                        Fill out the form below to create your TwitchViewer account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="Choose a username" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Your email address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Create a password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={registerForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirm your password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="turnstileToken"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Security Verification</FormLabel>
                                <FormControl>
                                  <BasicTurnstile
                                    onVerify={(token: string) => {
                                      console.log("Turnstile register verification success, token length:", token?.length || 0);
                                      field.onChange(token);
                                    }}
                                    onExpire={() => {
                                      console.log("Turnstile register token expired");
                                      field.onChange("");
                                    }}
                                    onError={(error: string) => {
                                      console.error("Turnstile register error:", error);
                                      field.onChange("");
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-md transition-all"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Create Account
                          </Button>
                        </form>
                      </Form>
                      
                      <div className="mt-8">
                        <Separator className="flex items-center justify-center">
                          <span className="px-4 text-xs text-gray-500 bg-white dark:bg-zinc-900">OR</span>
                        </Separator>
                        
                        <div className="mt-6">
                          <a
                            href="/api/auth/twitch"
                            className="flex items-center justify-center gap-2 w-full text-white bg-[#6441a5] hover:bg-[#7d5bbe] font-medium py-3 px-4 rounded-md transition-colors"
                          >
                            <SiTwitch className="h-5 w-5" />
                            <span>Continue with Twitch</span>
                          </a>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2 bg-gray-50 dark:bg-zinc-900/50 rounded-b-lg">
                      <div className="text-sm text-neutral-500">
                        Already have an account?{" "}
                        <button 
                          onClick={() => setActiveTab("login")}
                          className="text-indigo-600 hover:underline"
                        >
                          Sign in here
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="forgot">
                  <Card className="shadow-lg dark:shadow-purple-900/10">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        <button 
                          onClick={() => setActiveTab("login")} 
                          className="mr-2 text-gray-500 hover:text-gray-700"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <CardTitle>Reset Your Password</CardTitle>
                      </div>
                      <CardDescription>
                        Enter your email address and we'll send you a link to reset your password.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...resetRequestForm}>
                        <form onSubmit={resetRequestForm.handleSubmit(onResetRequestSubmit)} className="space-y-4">
                          <FormField
                            control={resetRequestForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Your email address" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={resetRequestForm.control}
                            name="turnstileToken"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Security Verification</FormLabel>
                                <FormControl>
                                  <BasicTurnstile
                                    onVerify={(token: string) => {
                                      console.log("Turnstile reset verification success, token length:", token?.length || 0);
                                      field.onChange(token);
                                    }}
                                    onExpire={() => {
                                      console.log("Turnstile reset token expired");
                                      field.onChange("");
                                    }}
                                    onError={(error: string) => {
                                      console.error("Turnstile reset error:", error);
                                      field.onChange("");
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            disabled={requestPasswordResetMutation.isPending}
                          >
                            {requestPasswordResetMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Send Reset Link
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reset">
                  <Card className="shadow-lg dark:shadow-purple-900/10">
                    <CardHeader>
                      <CardTitle>Set New Password</CardTitle>
                      <CardDescription>
                        Create a new password for your account.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...resetPasswordForm}>
                        <form onSubmit={resetPasswordForm.handleSubmit(onPasswordResetSubmit)} className="space-y-4">
                          <FormField
                            control={resetPasswordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Create a new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={resetPasswordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Confirm your new password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                            disabled={resetPasswordMutation.isPending}
                          >
                            {resetPasswordMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Reset Password
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Hero Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="space-y-6 text-center lg:text-left">
                <div className="flex justify-center lg:justify-start">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-md">
                    <LucideRocket className="h-5 w-5" />
                    <span className="text-sm font-medium">Premium Service</span>
                  </div>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Boost Your Twitch Audience Today
                </h1>
                
                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                  Accelerate your channel growth with our comprehensive viewer, chat, and follower solutions designed for Twitch streamers.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto lg:mx-0">
                  <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Real Engagement</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Genuine viewers that interact naturally with your content</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">24/7 Support</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Our team is available around the clock to help you succeed</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Safe & Secure</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Compliant with Twitch TOS for safety and peace of mind</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="rounded-full p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                      <Check className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">Flexible Plans</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">Choose the perfect package for your streaming goals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}