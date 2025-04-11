import { useState, useEffect, useRef } from "react";
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
import { Menu, X, LogOut, User, Settings, LayoutDashboard, ChevronRight, Sparkles, MessageCircle, Users } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  
  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Add scroll event listener to apply styles
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
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
    <header 
      ref={headerRef}
      className={`sticky top-0 backdrop-blur-md z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 shadow-md py-2' 
          : 'bg-white/50 shadow-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Ultra Premium Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <div className="font-bold flex items-center group relative">
                {/* Subtle background wave pattern on hover */}
                <div className="absolute -inset-3 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
                  <svg width="100" height="60" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0">
                    <path d="M0,30 C10,20 20,40 30,30 C40,20 50,40 60,30 C70,20 80,40 90,30 C100,20 110,40 120,30" stroke="currentColor" strokeWidth="1" fill="none" className="text-primary" />
                  </svg>
                </div>
                
                {/* Simplified, modern logo mark with 3D effect */}
                <div className="relative">
                  {/* Soft shadow for depth */}
                  <div className="absolute -inset-[2px] bg-black/5 rounded-xl blur-sm transform transition-all duration-300 group-hover:blur-md group-hover:bg-black/10"></div>
                  
                  {/* Main logo container */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-elevated transform transition-all duration-300 group-hover:scale-105 relative z-10 overflow-hidden">
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Subtle border highlight */}
                    <div className="absolute inset-0 rounded-xl border border-white/10 group-hover:border-white/20 transition-colors duration-300"></div>
                    
                    {/* Skyrocket Icon */}
                    <div className="relative z-20 flex items-center justify-center w-full h-full">
                      {/* Modern rocket icon */}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-7 h-7 transform group-hover:scale-110 group-hover:translate-y-[-2px] transition-all duration-300 animate-rocket-up"
                      >
                        <path d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                        <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
                      </svg>
                      
                      {/* Rocket animation only */}
                    </div>
                  </div>
                  
                  {/* Subtle reflection */}
                  <div className="absolute -bottom-0.5 left-1 right-1 h-1 rounded-b-xl bg-black/10 blur-sm"></div>
                </div>
                
                {/* Brand Text - 2 lines only */}
                <div className="relative ml-3 flex flex-col">
                  {/* Main brand name with gradient */}
                  <div className="relative overflow-hidden hidden sm:block">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 bg-clip-text text-transparent font-heading tracking-tight">
                      TwitchViewer
                    </h1>
                  </div>
                  
                  {/* Single tagline */}
                  <div className="hidden sm:flex items-center">
                    <div className="font-medium text-xs tracking-wider text-blue-900/70">
                      <span>BOOST YOUR AUDIENCE</span>
                    </div>
                    <span className="ml-1 text-[10px] text-blue-700 font-black opacity-0 group-hover:opacity-100 transition-all duration-500">PRO</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:space-x-2 xl:space-x-4">
            <NavLink href="/" isActive={isActivePath("/") && !isActivePath("/auth") && !isActivePath("/dashboard") && !isActivePath("/admin")}>
              Home
            </NavLink>
            
            <NavLink href="/viewer-bot">
              <Sparkles className="h-4 w-4 mr-1 inline-block" /> Viewer Bot
            </NavLink>
            
            <NavLink href="/chat-bot">
              <MessageCircle className="h-4 w-4 mr-1 inline-block" /> Chat Bot
            </NavLink>
            
            <NavLink href="/follow-bot">
              <Users className="h-4 w-4 mr-1 inline-block" /> Follow Bot
            </NavLink>
            
            <NavLink href="/pricing">
              Pricing
            </NavLink>
          </nav>
          
          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3 ml-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center rounded-xl border-neutral-200 shadow-soft hover:shadow-elevated transition-all duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-neutral-800">{user.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 border-neutral-200 rounded-xl shadow-elevated">
                  <DropdownMenuLabel className="text-neutral-500 text-xs font-normal uppercase tracking-wide">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <CustomDropdownItem href="/dashboard" icon={<LayoutDashboard />}>
                    Dashboard
                  </CustomDropdownItem>
                  {user.role === "admin" && (
                    <CustomDropdownItem href="/admin" icon={<Settings />}>
                      Admin Panel
                    </CustomDropdownItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth">
                  <Button 
                    variant="ghost" 
                    className="rounded-xl text-neutral-600 hover:text-primary hover:bg-primary/5"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="btn-gradient px-4 py-2 rounded-xl shadow-button hover:shadow-xl">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-primary hover:bg-primary/5 transition-colors duration-300"
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
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-[500px] border-b border-neutral-200' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
          <MobileNavLink href="/" isActive={isActivePath("/") && !isActivePath("/auth") && !isActivePath("/dashboard") && !isActivePath("/admin")}>
            Home
          </MobileNavLink>
          
          <MobileNavLink href="/viewer-bot">
            <Sparkles className="h-4 w-4 mr-2" /> Viewer Bot
          </MobileNavLink>
          
          <MobileNavLink href="/chat-bot">
            <MessageCircle className="h-4 w-4 mr-2" /> Chat Bot
          </MobileNavLink>
          
          <MobileNavLink href="/follow-bot">
            <Users className="h-4 w-4 mr-2" /> Follow Bot
          </MobileNavLink>
          
          <MobileNavLink href="/pricing">
            Pricing
          </MobileNavLink>
          
          {user ? (
            <>
              <div className="pt-4 pb-3 border-t border-neutral-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-violet-600/80 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-neutral-800">{user.username}</div>
                    <div className="text-sm font-medium text-neutral-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <MobileNavLink href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </MobileNavLink>
                  
                  {user.role === "admin" && (
                    <MobileNavLink href="/admin">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Panel
                    </MobileNavLink>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="grid grid-cols-2 gap-3 p-3">
                <Link href="/auth">
                  <Button 
                    variant="outline" 
                    className="w-full px-4 py-5 rounded-xl border-neutral-200 shadow-soft hover:shadow-md text-neutral-700"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button className="w-full btn-gradient px-4 py-5 rounded-xl shadow-button hover:shadow-xl">
                    Sign up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Desktop navigation link component
function NavLink({ href, children, isActive = false }: { href: string, children: React.ReactNode, isActive?: boolean }) {
  return (
    <a 
      href={href} 
      className={`nav-link px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'active' : ''}`}
    >
      {children}
    </a>
  );
}

// Mobile navigation link component
function MobileNavLink({ href, children, isActive = false }: { href: string, children: React.ReactNode, isActive?: boolean }) {
  return (
    <a 
      href={href} 
      className={`flex items-center px-3 py-3 rounded-lg text-base font-medium ${
        isActive 
          ? 'text-primary bg-primary/5' 
          : 'text-neutral-600 hover:text-primary hover:bg-neutral-50'
      } transition-colors duration-300`}
    >
      {children}
    </a>
  );
}

// Dropdown menu item with icon and href
function CustomDropdownItem({ 
  href, 
  children, 
  icon 
}: { 
  href: string, 
  children: React.ReactNode, 
  icon: React.ReactNode 
}) {
  return (
    <a href={href}>
      <DropdownMenuItem className="cursor-pointer group">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="h-4 w-4 mr-2 text-primary">{icon}</span>
            <span>{children}</span>
          </div>
          <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-primary transition-colors duration-300 group-hover:translate-x-0.5 transform transition-transform" />
        </div>
      </DropdownMenuItem>
    </a>
  );
}
