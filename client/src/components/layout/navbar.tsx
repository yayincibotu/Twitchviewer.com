import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, LogOut, User, Settings, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Check if current path matches
  const isActivePath = (path: string) => {
    if (path === "/") {
      return location === path;
    }
    return location.startsWith(path);
  };
  
  return (
    <header className="sticky top-0 bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-primary flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2">
                  <path d="M4 3h16v12h-6l-4 4v-4H4V3zm12 4h-2v4h2V7zm-6 0h2v4h-2V7z"/>
                </svg>
                <span>TwitchViewer</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            <Link href="/">
              <a className={`inline-flex items-center px-1 pt-1 border-b-2 ${
                isActivePath("/") && !isActivePath("/auth") && !isActivePath("/dashboard") && !isActivePath("/admin")
                  ? "border-primary text-neutral-800"
                  : "border-transparent text-neutral-600 hover:text-neutral-800 hover:border-neutral-300"
              } text-sm font-medium transition`}>
                Home
              </a>
            </Link>
            <a href="/#features" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:border-neutral-300 transition">
              Features
            </a>
            <a href="/#pricing" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:border-neutral-300 transition">
              Pricing
            </a>
            <a href="/#contact" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:border-neutral-300 transition">
              Contact
            </a>
          </nav>
          
          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {user.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  {user.role === "admin" && (
                    <Link href="/admin">
                      <DropdownMenuItem className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <a className="text-neutral-600 hover:text-neutral-800 px-3 py-2 rounded-md text-sm font-medium">
                    Sign in
                  </a>
                </Link>
                <Link href="/auth">
                  <Button className="bg-primary hover:bg-primary-dark text-white">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-b border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/">
              <a className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActivePath("/") && !isActivePath("/auth") && !isActivePath("/dashboard") && !isActivePath("/admin")
                  ? "text-primary bg-neutral-100"
                  : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
              }`}>
                Home
              </a>
            </Link>
            <a href="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
              Features
            </a>
            <a href="/#pricing" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
              Pricing
            </a>
            <a href="/#contact" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
              Contact
            </a>
            
            {user ? (
              <>
                <div className="pt-4 pb-3 border-t border-neutral-200">
                  <div className="flex items-center px-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-neutral-800">{user.username}</div>
                      <div className="text-sm font-medium text-neutral-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <Link href="/dashboard">
                      <a className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
                        Dashboard
                      </a>
                    </Link>
                    {user.role === "admin" && (
                      <Link href="/admin">
                        <a className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
                          Admin Panel
                        </a>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-4 pb-3 border-t border-neutral-200">
                <Link href="/auth">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100">
                    Sign in
                  </a>
                </Link>
                <Link href="/auth">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark my-2">
                    Sign up
                  </a>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
