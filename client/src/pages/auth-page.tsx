import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, registerSchema, passwordResetRequestSchema, resetPasswordSchema } from "@/hooks/use-auth";
import { Loader2, ArrowLeft, Check, LucideRocket } from "lucide-react";
import { TurnstileWidget } from "@/components/ui/turnstile";

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
            <div className="w-full lg:w-1/2 flex items-center">
              <div className="p-8 rounded-xl bg-gradient-to-br from-indigo-600/80 to-purple-700/80 shadow-lg w-full text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern bg-[length:20px_20px] opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
                
                {/* Animated bubble decorations */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-blob"></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-40 left-20 w-36 h-36 bg-indigo-400/10 rounded-full blur-xl animate-blob animation-delay-4000"></div>
                
                <div className="relative z-10 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start mb-6">
                    <LucideRocket className="h-8 w-8 mr-3 text-indigo-300" />
                    <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                      Boost Your Twitch Success
                    </h1>
                  </div>
                  
                  <p className="text-indigo-100 mb-8 text-lg max-w-lg">
                    Join thousands of streamers who have increased their visibility and grown their audience with our premium Twitch services.
                  </p>
                  
                  <div className="space-y-4 mb-8 text-left max-w-md mx-auto lg:mx-0">
                    <div className="flex items-start bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-indigo-500 p-1 rounded mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Real Viewers</h3>
                        <p className="text-sm text-indigo-200">Boost your channel's visibility with our authentic viewer service</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-indigo-500 p-1 rounded mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Interactive Chat Bots</h3>
                        <p className="text-sm text-indigo-200">Engage your audience with smart, responsive chat interactions</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                      <div className="bg-indigo-500 p-1 rounded mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Follower Growth</h3>
                        <p className="text-sm text-indigo-200">Build your channel with our targeted follower service</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                    <div className="flex items-center">
                      <SiTwitch className="h-5 w-5 mr-2 text-[#6441a5]" />
                      <span className="font-medium">Trusted by 10,000+ streamers</span>
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
