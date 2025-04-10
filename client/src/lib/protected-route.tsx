import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  path,
  component: Component,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If email not verified, warn the user (except for admin users)
  if (!user.emailVerified && user.role !== "admin") {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Email Verification Required</h1>
            <p className="mb-4 text-neutral-600">
              Please verify your email address before accessing this page. Check your inbox for a verification email or click the button below to resend.
            </p>
            <button 
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md transition-colors"
              onClick={() => {
                // In a real app, this would trigger an API call to resend the verification email
                alert("Verification email sent. Please check your inbox.");
              }}
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      </Route>
    );
  }

  // If admin route and user is not admin, redirect to dashboard
  if (requireAdmin && user.role !== "admin") {
    return (
      <Route path={path}>
        <Redirect to="/dashboard" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
