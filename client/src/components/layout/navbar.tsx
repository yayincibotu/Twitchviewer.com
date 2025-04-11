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
import { Menu, X, LogOut, User, Settings, LayoutDashboard, ChevronRight } from "lucide-react";

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
                {/* SVG Background Patterns */}
                <div className="absolute -inset-3 opacity-0 group-hover:opacity-10 transition-opacity duration-700">
                  <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 transform rotate-45 group-hover:rotate-[60deg] transition-transform duration-1000">
                    <path d="M10,30 Q50,10 90,30 T170,30" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                    <path d="M10,35 Q50,15 90,35 T170,35" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                    <path d="M10,40 Q50,20 90,40 T170,40" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                    <path d="M10,45 Q50,25 90,45 T170,45" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                    <path d="M10,50 Q50,30 90,50 T170,50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                    <path d="M10,55 Q50,35 90,55 T170,55" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-primary" />
                  </svg>
                </div>
                
                {/* Animated logo mark - layered 3D effect */}
                <div className="relative">
                  {/* Deep shadow base */}
                  <div className="absolute -inset-[3px] bg-black/10 rounded-2xl blur-md transform transition-all duration-500 group-hover:blur-lg group-hover:inset-[-5px]"></div>
                  
                  {/* Light reflection layer */}
                  <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-tr from-white/80 via-transparent to-transparent opacity-20 group-hover:opacity-30 transition-opacity duration-500 group-hover:blur-sm"></div>
                  
                  {/* Main logo hexagon container */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-800 to-violet-900 flex items-center justify-center text-white shadow-elevated transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-6 relative z-10 overflow-hidden">
                    {/* Animated radar sweep effect */}
                    <div className="absolute inset-0 animate-spin-slow opacity-20 pointer-events-none">
                      <div className="absolute top-1/2 bottom-0 left-0 right-1/2 bg-gradient-to-tr from-blue-400 to-transparent blur-md"></div>
                    </div>
                    
                    {/* Main background glow */}
                    <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/30 via-violet-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    
                    {/* Border highlight */}
                    <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/20 transition-colors duration-300 pointer-events-none"></div>
                    
                    {/* Twitch icon with animation */}
                    <div className="relative z-20 flex items-center justify-center w-full h-full">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor" 
                        className="w-7 h-7 transform group-hover:scale-110 group-hover:rotate-[-6deg] transition-all duration-500"
                      >
                        <path d="M4 3h16v12h-6l-4 4v-4H4V3zm12 4h-2v4h2V7zm-6 0h2v4h-2V7z"/>
                      </svg>
                      
                      {/* Viewer count pulse indicator */}
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-400 shadow-glow">
                        {/* Expanding rings effect */}
                        <div className="absolute inset-0 rounded-full animate-ping bg-green-400/70"></div>
                        <div className="absolute -inset-1 rounded-full animate-ping bg-green-400/30 animation-delay-150"></div>
                        <div className="absolute -inset-2 rounded-full animate-ping bg-green-400/10 animation-delay-300"></div>
                      </div>
                    </div>
                    
                    {/* Particle effects */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-white/80 animate-float animation-delay-100"></div>
                      <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 rounded-full bg-white/60 animate-float animation-delay-200"></div>
                      <div className="absolute bottom-1/4 right-1/3 w-1 h-1 rounded-full bg-white/70 animate-float animation-delay-300"></div>
                    </div>
                  </div>
                  
                  {/* 3D edge and reflection */}
                  <div className="absolute -bottom-1 -right-1 left-1 h-2 rounded-b-xl bg-black/20 blur-sm transform transition-transform duration-500 group-hover:scale-105 group-hover:rotate-6"></div>
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Brand Text with premium styling */}
                <div className="relative ml-4 flex flex-col">
                  {/* Main brand name with shine effect */}
                  <div className="relative overflow-hidden hidden sm:block">
                    <span className="text-2xl md:text-2xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 bg-clip-text text-transparent font-heading tracking-tight leading-none">
                      Twitch<span className="font-black">Viewer</span>
                    </span>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 w-full group-hover:animate-shine pointer-events-none">
                      <div className="absolute -inset-full top-0 right-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
                    </div>
                  </div>
                  
                  {/* Advanced tagline with animations */}
                  <div className="hidden sm:flex items-center space-x-1">
                    <div className="h-3 w-3 rounded-full bg-blue-700/20 relative overflow-hidden">
                      <div className="absolute inset-0 rounded-full bg-blue-600 scale-0 group-hover:scale-100 transition-transform duration-700 origin-left"></div>
                    </div>
                    <div className="font-medium text-xs tracking-wider text-blue-900/60 group-hover:text-blue-800 transition-colors duration-300 flex items-center overflow-hidden">
                      <span className="translate-y-0 group-hover:-translate-y-full transition-transform duration-300">VIEWER BOOST</span>
                      <span className="absolute translate-y-full group-hover:translate-y-0 transition-transform duration-300 text-blue-700">PREMIUM SERVICE</span>
                    </div>
                    <span className="text-[10px] text-blue-700 font-black opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-[-5px]">PRO</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-1 lg:space-x-2">
            <NavLink href="/" isActive={isActivePath("/") && !isActivePath("/auth") && !isActivePath("/dashboard") && !isActivePath("/admin")}>
              Home
            </NavLink>
            
            <NavLink href="/#features">
              Features
            </NavLink>
            
            <NavLink href="/#pricing">
              Pricing
            </NavLink>
            
            <NavLink href="/#contact">
              Contact
            </NavLink>
          </nav>
          
          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
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
          <div className="flex md:hidden">
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
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMenuOpen ? 'max-h-[500px] border-b border-neutral-200' : 'max-h-0'
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
          <MobileNavLink href="/" isActive={isActivePath("/") && !isActivePath("/auth") && !isActivePath("/dashboard") && !isActivePath("/admin")}>
            Home
          </MobileNavLink>
          
          <MobileNavLink href="/#features">
            Features
          </MobileNavLink>
          
          <MobileNavLink href="/#pricing">
            Pricing
          </MobileNavLink>
          
          <MobileNavLink href="/#contact">
            Contact
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
