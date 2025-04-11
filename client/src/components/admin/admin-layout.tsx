import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import { Loader2, Bell, Search, User, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminSidebar from "./admin-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
  description?: string;
};

export default function AdminLayout({ 
  children, 
  title, 
  description = "Admin dashboard for TwitchViewer.com" 
}: AdminLayoutProps) {
  const { user, isLoading, logoutMutation } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect if user is not logged in or not an admin
  if (!user || user.role !== "admin") {
    return <Redirect to="/auth" />;
  }

  return (
    <>
      <Helmet>
        <title>{title} - Admin Panel</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="min-h-screen bg-zinc-50">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-border bg-white px-4 shadow-sm">
          <div className="flex h-full items-center px-4">
            <div className="flex items-center gap-2">
              <a href="/" className="flex items-center gap-2">
                <span className="font-bold text-xl text-primary">TwitchViewer.com</span>
              </a>
              <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                Admin
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Search */}
            <div className="hidden md:flex relative mr-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-md border border-input bg-background pl-8 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="mr-2">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.username?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <main className="pt-16 pl-64">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}