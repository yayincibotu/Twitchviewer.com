import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { 
  User, 
  UserPlus, 
  Filter, 
  Search,
  DownloadCloud,
  RefreshCw
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { UsersTable } from "@/components/admin/users-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");

  // Fetch users
  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['/api/users'],
  });

  // Filter users based on search query and filters
  const filteredUsers = users?.filter(user => {
    // Search by username or email
    const matchesSearch = 
      searchQuery === "" || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by role
    const matchesRole = 
      roleFilter === "all" || 
      user.role === roleFilter;
    
    // Filter by verification status
    const matchesVerification = 
      verificationFilter === "all" || 
      (verificationFilter === "verified" && user.emailVerified) ||
      (verificationFilter === "unverified" && !user.emailVerified);
    
    return matchesSearch && matchesRole && matchesVerification;
  });

  return (
    <AdminLayout title="User Management" description="Manage users, roles, and permissions">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/admin/users/new">
                <UserPlus className="mr-2 h-4 w-4" />
                New User
              </a>
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filters</CardTitle>
            <CardDescription>
              Filter users by role, verification status, or search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by username or email"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Role
                </label>
                <Select 
                  value={roleFilter}
                  onValueChange={setRoleFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Roles</SelectLabel>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Verification
                </label>
                <Select 
                  value={verificationFilter}
                  onValueChange={setVerificationFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Verification status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="unverified">Unverified</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <UsersTable data={filteredUsers || []} />
        )}

        {/* Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>
              Overview of user account statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Total Users</div>
                <div className="text-2xl font-bold">{users?.length || 0}</div>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Verified Users</div>
                <div className="text-2xl font-bold">
                  {users?.filter(user => user.emailVerified).length || 0}
                </div>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">Admins</div>
                <div className="text-2xl font-bold">
                  {users?.filter(user => user.role === "admin").length || 0}
                </div>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <div className="text-muted-foreground text-sm">With Subscription</div>
                <div className="text-2xl font-bold">
                  {users?.filter(user => user.stripeSubscriptionId).length || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}