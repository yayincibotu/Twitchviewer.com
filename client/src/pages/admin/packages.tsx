import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { 
  Package, 
  Plus, 
  Filter, 
  Search,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
  ArrowUpDown
} from "lucide-react";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  maxViewers: number;
  features: string[];
  stripePriceId: string;
}

export default function AdminPackagesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch packages
  const { data: packages, isLoading, refetch } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  // Package mutations
  const deletePackageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/packages'] });
      toast({
        title: "Package deleted",
        description: "The package has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete package",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter packages based on search query
  const filteredPackages = packages?.filter(pkg => 
    searchQuery === "" || 
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return `$${(price / 100).toFixed(2)}`;
  }

  return (
    <AdminLayout title="Package Management" description="Manage subscription packages">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Package Management</h1>
            <p className="text-muted-foreground">
              Manage subscription packages and pricing
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="default" asChild>
              <a href="/admin/packages/new">
                <Plus className="mr-2 h-4 w-4" />
                New Package
              </a>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search packages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Packages Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Packages</CardTitle>
            <CardDescription>
              Manage your subscription packages and pricing tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Price
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Max Viewers</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!filteredPackages?.length ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No packages found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell>{pkg.id}</TableCell>
                          <TableCell>
                            <div className="font-medium">{pkg.name}</div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate">{pkg.description}</div>
                          </TableCell>
                          <TableCell>{formatPrice(pkg.price)}</TableCell>
                          <TableCell>{pkg.maxViewers}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {pkg.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="outline" className="flex items-center gap-1">
                                  <Check className="h-3 w-3" />
                                  <span className="truncate max-w-[100px]">{feature}</span>
                                </Badge>
                              ))}
                              {pkg.features.length > 2 && (
                                <Badge variant="outline">+{pkg.features.length - 2} more</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => window.location.href = `/admin/packages/${pkg.id}`}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete the ${pkg.name} package?`)) {
                                      deletePackageMutation.mutate(pkg.id);
                                    }
                                  }}
                                  className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {filteredPackages?.length} packages found
            </div>
          </CardFooter>
        </Card>

        {/* Package Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {isLoading ? (
            <>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </>
          ) : (
            filteredPackages?.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col justify-between">
                <CardHeader>
                  <CardTitle>{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">{formatPrice(pkg.price)}</div>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/admin/packages/${pkg.id}`}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}