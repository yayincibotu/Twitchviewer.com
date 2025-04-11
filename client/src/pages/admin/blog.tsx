import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  BookOpen, 
  Plus, 
  Search,
  RefreshCw,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Eye,
  EyeOff,
  Tag,
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
import { format } from 'date-fns';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  featuredImage: string | null;
  authorId: number | null;
  tags: string[] | null;
  publishDate: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
}

export default function AdminBlogPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [publishedFilter, setPublishedFilter] = useState("all");

  // Fetch blog posts
  const { data: blogPosts, isLoading, refetch } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts', 'admin'],
  });

  // Blog post mutations
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: number, isPublished: boolean }) => {
      await apiRequest("PATCH", `/api/blog/posts/${id}`, { isPublished });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Post status updated",
        description: "The blog post status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update post status",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Filter blog posts based on search query and publish status
  const filteredBlogPosts = blogPosts?.filter(post => {
    const matchesSearch = 
      searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesPublished = 
      publishedFilter === "all" || 
      (publishedFilter === "published" && post.isPublished) ||
      (publishedFilter === "draft" && !post.isPublished);
    
    return matchesSearch && matchesPublished;
  });

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No date";
    return format(new Date(dateString), 'PPP');
  };

  // Truncate text helper
  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + "...";
  };

  return (
    <AdminLayout title="Blog Management" description="Manage blog posts and articles">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage your blog content
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="default" asChild>
              <a href="/admin/blog/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </a>
            </Button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">
              Status
            </label>
            <Select 
              value={publishedFilter}
              onValueChange={setPublishedFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Post Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Blog Posts Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Blog Posts</CardTitle>
            <CardDescription>
              Manage your blog content, SEO, and publishing status
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
                      <TableHead>
                        <div className="flex items-center">
                          Title
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!filteredBlogPosts?.length ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No blog posts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>{post.id}</TableCell>
                          <TableCell>
                            <div className="font-medium max-w-[250px] truncate">{post.title}</div>
                            <div className="text-sm text-muted-foreground max-w-[250px] truncate">
                              {truncate(post.excerpt, 50)}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {post.slug}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {post.tags && post.tags.length > 0 ? (
                                <>
                                  {post.tags.slice(0, 2).map((tag, index) => (
                                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                                      <Tag className="h-3 w-3" />
                                      <span className="truncate max-w-[60px]">{tag}</span>
                                    </Badge>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <Badge variant="outline">+{post.tags.length - 2} more</Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground text-xs">No tags</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs">{formatDate(post.publishDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {post.isPublished ? (
                              <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                <Eye className="mr-1 h-3 w-3" />
                                Published
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-500 border-amber-500">
                                <EyeOff className="mr-1 h-3 w-3" />
                                Draft
                              </Badge>
                            )}
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
                                  onClick={() => window.location.href = `/admin/blog/${post.id}`}
                                  className="cursor-pointer"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => togglePublishMutation.mutate({ 
                                    id: post.id, 
                                    isPublished: !post.isPublished 
                                  })}
                                  className="cursor-pointer"
                                >
                                  {post.isPublished ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      Publish
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to delete the blog post "${post.title}"?`)) {
                                      deleteBlogPostMutation.mutate(post.id);
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
              {filteredBlogPosts?.length} posts found
            </div>
          </CardFooter>
        </Card>

        {/* Blog Post Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-16" /> : blogPosts?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total blog posts in the system
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  blogPosts?.filter(post => post.isPublished).length || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Live and visible posts
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  blogPosts?.filter(post => !post.isPublished).length || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unpublished draft posts
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}