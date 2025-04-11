import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

type DashboardCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  link?: {
    href: string;
    label: string;
  };
};

export function DashboardCard({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  link 
}: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <span
              className={`flex items-center gap-0.5 text-xs font-medium ${
                trend.isPositive ? "text-success" : "text-destructive"
              }`}
            >
              {trend.isPositive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-3 w-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.916.369l-4.453-1.498a.75.75 0 01.468-1.424l2.722.915a19.409 19.409 0 00-3.585-6.566L7 10.945 1.72 5.665a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">
              {trend.label}
            </span>
          </div>
        )}
        {link && (
          <div className="mt-3">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" asChild>
              <a href={link.href}>
                {link.label}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type DashboardStatsProps = {
  stats: {
    title: string;
    value: string | number;
    description?: string;
    icon: ReactNode;
    trend?: {
      value: number;
      label: string;
      isPositive: boolean;
    };
    link?: {
      href: string;
      label: string;
    };
  }[];
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <DashboardCard key={index} {...stat} />
      ))}
    </div>
  );
}