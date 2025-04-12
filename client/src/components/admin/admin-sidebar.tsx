import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  Package2,
  Globe,
  BarChart2,
  Settings,
  ChevronDown,
  Tag,
  MessageSquare,
  Star,
  FileText,
  ShieldCheck,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: number;
  isActive?: boolean;
  onClick?: () => void;
};

function NavItem({ href, icon, children, badge, isActive, onClick }: NavItemProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        size="lg"
        className={cn(
          "w-full justify-start gap-2 font-normal hover:bg-muted",
          isActive && "bg-muted font-medium text-primary"
        )}
        onClick={onClick}
      >
        {icon}
        <span className="flex-1 text-left">{children}</span>
        {badge && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {badge}
          </span>
        )}
      </Button>
    </Link>
  );
}

type NavGroupProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function NavGroup({ title, icon, children, defaultOpen = false }: NavGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="w-full justify-start gap-2 font-normal"
        >
          {icon}
          <span className="flex-1 text-left">{title}</span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 px-8 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function AdminSidebar() {
  const [location] = useLocation();

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-border shadow-sm p-4 pt-24 flex flex-col gap-2 overflow-auto scrollbar-thin">
      <div className="space-y-1">
        <NavItem 
          href="/admin" 
          icon={<LayoutDashboard className="h-5 w-5" />} 
          isActive={location === "/admin"}
        >
          Dashboard
        </NavItem>
        
        <NavGroup 
          title="Users" 
          icon={<Users className="h-5 w-5" />}
          defaultOpen={location.startsWith("/admin/users")}
        >
          <NavItem 
            href="/admin/users" 
            icon={<Users className="h-4 w-4" />} 
            isActive={location === "/admin/users"}
          >
            All Users
          </NavItem>
          <NavItem 
            href="/admin/users/new" 
            icon={<Users className="h-4 w-4" />} 
            isActive={location === "/admin/users/new"}
          >
            Create User
          </NavItem>
        </NavGroup>
        
        <NavGroup 
          title="Packages" 
          icon={<Package2 className="h-5 w-5" />}
          defaultOpen={location.startsWith("/admin/packages")}
        >
          <NavItem 
            href="/admin/packages" 
            icon={<Package2 className="h-4 w-4" />} 
            isActive={location === "/admin/packages"}
          >
            All Packages
          </NavItem>
          <NavItem 
            href="/admin/packages/new" 
            icon={<Tag className="h-4 w-4" />} 
            isActive={location === "/admin/packages/new"}
          >
            Create Package
          </NavItem>
        </NavGroup>
        
        <NavGroup 
          title="Content" 
          icon={<FileText className="h-5 w-5" />}
          defaultOpen={location.startsWith("/admin/content")}
        >
          <NavItem 
            href="/admin/content/seo" 
            icon={<Globe className="h-4 w-4" />} 
            isActive={location === "/admin/content/seo"}
          >
            SEO Settings
          </NavItem>
          <NavItem 
            href="/admin/content/success-stories" 
            icon={<Star className="h-4 w-4" />} 
            isActive={location === "/admin/content/success-stories"}
          >
            Success Stories
          </NavItem>
          <NavItem 
            href="/admin/content/faq" 
            icon={<MessageSquare className="h-4 w-4" />} 
            isActive={location === "/admin/content/faq"}
          >
            FAQ
          </NavItem>
        </NavGroup>
        
        <NavGroup 
          title="Marketing" 
          icon={<BarChart2 className="h-5 w-5" />}
          defaultOpen={location.startsWith("/admin/marketing")}
        >
          <NavItem 
            href="/admin/marketing/statistics" 
            icon={<BarChart2 className="h-4 w-4" />} 
            isActive={location === "/admin/marketing/statistics"}
          >
            Statistics
          </NavItem>
          <NavItem 
            href="/admin/marketing/security-badges" 
            icon={<ShieldCheck className="h-4 w-4" />} 
            isActive={location === "/admin/marketing/security-badges"}
          >
            Security Badges
          </NavItem>
          <NavItem 
            href="/admin/marketing/offers" 
            icon={<Clock className="h-4 w-4" />} 
            isActive={location === "/admin/marketing/offers"}
          >
            Limited Time Offers
          </NavItem>
        </NavGroup>
        
        <NavItem 
          href="/admin/settings" 
          icon={<Settings className="h-5 w-5" />} 
          isActive={location === "/admin/settings"}
        >
          Settings
        </NavItem>
      </div>
    </aside>
  );
}