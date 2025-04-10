import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Eager-loaded ana sayfa (kritik sayfa, hızlı yüklenmeli)
import HomePage from "@/pages/home-page";

// Lazy-loaded sayfalar (kod bölme - Code splitting)
const NotFound = lazy(() => import("@/pages/not-found"));
const AuthPage = lazy(() => import("@/pages/auth-page"));
const DashboardPage = lazy(() => import("@/pages/dashboard-page"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const CheckoutPage = lazy(() => import("@/pages/checkout"));

// Sayfa yüklenirken gösterilecek fallback bileşeni
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg text-muted-foreground">Sayfa yükleniyor...</p>
    </div>
  </div>
);

function Router() {
  return (
    // Suspense ile lazy loading sırasında gösterilecek fallback bileşeni belirleyin
    <Suspense fallback={<PageLoader />}>
      <Switch>
        {/* Ana sayfa eager-loaded */}
        <Route path="/" component={HomePage} />
        
        {/* Diğer sayfalar lazy-loaded */}
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/dashboard" component={DashboardPage} />
        <ProtectedRoute path="/admin" component={AdminDashboard} requireAdmin />
        <ProtectedRoute path="/checkout/:packageId" component={CheckoutPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
