import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Users, 
  CreditCard, 
  Activity, 
  TrendingUp, 
  BarChart2, 
  BoxSelect,
  UserPlus,
  Package,
  Settings,
  LogOut
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { DashboardStats } from "@/components/admin/dashboard-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Sample chart data
const revenueData = [
  { name: "Jan", revenue: 1800 },
  { name: "Feb", revenue: 2200 },
  { name: "Mar", revenue: 2700 },
  { name: "Apr", revenue: 2400 },
  { name: "May", revenue: 3100 },
  { name: "Jun", revenue: 3500 },
  { name: "Jul", revenue: 3800 },
];

const usersData = [
  { name: "Jan", users: 150 },
  { name: "Feb", users: 210 },
  { name: "Mar", users: 320 },
  { name: "Apr", users: 380 },
  { name: "May", users: 450 },
  { name: "Jun", users: 560 },
  { name: "Jul", users: 620 },
];

export default function AdminDashboardPage() {
  // Fetch users count
  const { data: usersCount, isLoading: loadingUsers } = useQuery({
    queryKey: ['/api/users/count'],
  });
  
  // Fetch packages count
  const { data: packagesCount, isLoading: loadingPackages } = useQuery({
    queryKey: ['/api/packages'],
    select: (data) => data.length,
  });
  
  // Fetch statistics
  const { data: statistics, isLoading: loadingStatistics } = useQuery({
    queryKey: ['/api/statistics'],
  });
  
  const dashboardStats = [
    {
      title: "Total Users",
      value: loadingUsers ? "Loading..." : usersCount || "0",
      icon: <Users className="h-5 w-5" />,
      trend: {
        value: 12,
        label: "from last month",
        isPositive: true,
      },
      link: {
        href: "/admin/users",
        label: "View all users",
      },
    },
    {
      title: "Active Subscriptions",
      value: "32",
      icon: <CreditCard className="h-5 w-5" />,
      trend: {
        value: 8,
        label: "from last month",
        isPositive: true,
      },
      link: {
        href: "/admin/subscriptions",
        label: "View all subscriptions",
      },
    },
    {
      title: "Active Viewers",
      value: statistics?.[0]?.value || "0",
      icon: <Activity className="h-5 w-5" />,
      trend: {
        value: 15,
        label: "from yesterday",
        isPositive: true,
      },
    },
    {
      title: "Monthly Revenue",
      value: "$5,253",
      icon: <TrendingUp className="h-5 w-5" />,
      trend: {
        value: 4,
        label: "from last month",
        isPositive: false,
      },
      link: {
        href: "/admin/finance",
        label: "View finances",
      },
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "user",
      title: "New user registered",
      timestamp: "5 minutes ago",
      icon: <UserPlus className="h-4 w-4" />,
    },
    {
      id: 2,
      type: "subscription",
      title: "User upgraded to Pro plan",
      timestamp: "12 minutes ago",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: 3,
      type: "package",
      title: "Package updated",
      timestamp: "1 hour ago",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: 4,
      type: "user",
      title: "User changed email",
      timestamp: "2 hours ago",
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 5,
      type: "subscription",
      title: "Subscription canceled",
      timestamp: "5 hours ago",
      icon: <CreditCard className="h-4 w-4" />,
    },
  ];

  return (
    <AdminLayout title="Dashboard" description="Admin dashboard overview">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">Download Report</Button>
            <Button>Refresh</Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <DashboardStats stats={dashboardStats} />
        
        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Tabs defaultValue="revenue" className="bg-white rounded-lg border shadow-sm">
            <CardHeader className="p-6 pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Analytics</CardTitle>
                <TabsList>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </TabsList>
              </div>
              <CardDescription>View your analytics data.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-3">
              <TabsContent value="revenue" className="h-[300px] mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value) => [`$${value}`, "Revenue"]}
                      contentStyle={{
                        borderRadius: "6px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="users" className="h-[300px] mt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={usersData}
                    margin={{
                      top: 10,
                      right: 20,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value}`, "Users"]}
                      contentStyle={{
                        borderRadius: "6px",
                        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#colorUsers)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader className="p-6 pb-2">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Recent user and system activity.</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Access */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription className="text-blue-100">
                View, edit, and manage user accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{loadingUsers ? "..." : usersCount || "0"}</div>
                <Button variant="secondary" size="sm" asChild>
                  <a href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardHeader>
              <CardTitle>Packages</CardTitle>
              <CardDescription className="text-purple-100">
                Manage subscription packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{loadingPackages ? "..." : packagesCount || "0"}</div>
                <Button variant="secondary" size="sm" asChild>
                  <a href="/admin/packages">
                    <BoxSelect className="h-4 w-4 mr-2" />
                    Manage Packages
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription className="text-emerald-100">
                View detailed analytics and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">Reports</div>
                <Button variant="secondary" size="sm" asChild>
                  <a href="/admin/analytics">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    View Reports
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}