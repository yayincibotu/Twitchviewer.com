import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { 
  ArrowLeft, 
  SaveIcon, 
  Trash2, 
  Calendar, 
  EyeIcon, 
  TagIcon, 
  ImageIcon,
  Link as LinkIcon,
  AlignLeft,
  MessageSquare,
  Globe
} from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "@/components/admin/admin-layout";
import MediaLibrary from "@/components/admin/media-library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Schema for blog post validation
const BlogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(200, "Excerpt must be less than 200 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  publishDate: z.date().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().default(false),
});

type BlogPostFormValues = z.infer<typeof BlogPostSchema>;

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

export default function BlogFormPage() {
  const { toast } = useToast();
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const [tagInput, setTagInput] = useState("");
  const isEditing = Boolean(id);

  // Query for fetching blog post data when editing
  const { data: blogPost, isLoading } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', id],
    enabled: isEditing,
  });

  // Prepare the form with default values
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      slug: "",
      metaTitle: "",
      metaDescription: "",
      featuredImage: "",
      tags: [],
      isPublished: false,
    },
  });

  // Update form values when editing existing post
  useEffect(() => {
    if (blogPost && isEditing) {
      form.reset({
        title: blogPost.title,
        content: blogPost.content,
        excerpt: blogPost.excerpt,
        slug: blogPost.slug,
        metaTitle: blogPost.metaTitle || "",
        metaDescription: blogPost.metaDescription || "",
        featuredImage: blogPost.featuredImage || "",
        publishDate: blogPost.publishDate ? new Date(blogPost.publishDate) : undefined,
        tags: blogPost.tags || [],
        isPublished: blogPost.isPublished,
      });
    }
  }, [blogPost, form, isEditing]);

  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues("title");
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      form.setValue("slug", slug, { shouldValidate: true });
    }
  };

  // Add a tag to the tags array
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues("tags") || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove a tag from the tags array
  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (values: BlogPostFormValues) => {
      const response = await apiRequest("POST", "/api/blog/posts", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post created",
        description: "The blog post has been successfully created.",
      });
      setLocation("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: BlogPostFormValues) => {
      const response = await apiRequest("PATCH", `/api/blog/posts/${id}`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post updated",
        description: "The blog post has been successfully updated.",
      });
      setLocation("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/blog/posts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/posts'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been successfully deleted.",
      });
      setLocation("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form submission handler
  const onSubmit = (values: BlogPostFormValues) => {
    if (isEditing) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  if (isEditing && isLoading) {
    return (
      <AdminLayout title="Loading Blog Post" description="Please wait...">
        <div className="space-y-6">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-12 w-1/3" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={isEditing ? "Edit Blog Post" : "Create Blog Post"} 
      description={isEditing ? "Update an existing blog post" : "Create a new blog post"}
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLocation("/admin/blog")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Posts
            </Button>
            <h1 className="text-3xl font-bold ml-2">
              {isEditing ? "Edit Blog Post" : "Create Blog Post"}
            </h1>
          </div>
          <div className="flex gap-2">
            {isEditing && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the
                      blog post "{blogPost?.title}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => deleteMutation.mutate()}
                      className="bg-destructive text-destructive-foreground"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Post"}
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs defaultValue="content">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">
                  <AlignLeft className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="seo">
                  <Globe className="mr-2 h-4 w-4" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="settings">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter blog post title"
                          {...field}
                          onBlur={() => {
                            if (!isEditing && !form.getValues("slug")) {
                              generateSlug();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 ml-2 text-xs"
                            onClick={generateSlug}
                          >
                            Generate
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md text-muted-foreground text-sm">
                              /blog/
                            </span>
                            <Input
                              placeholder="my-blog-post"
                              className="rounded-l-none"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featuredImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              value={field.value || ""}
                            />
                            <MediaLibrary 
                              onSelect={(url) => field.onChange(url)}
                              buttonVariant="outline"
                              buttonSize="icon"
                              selectedMedia={field.value}
                            >
                              <ImageIcon className="h-4 w-4" />
                            </MediaLibrary>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a brief excerpt of your post"
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be displayed in blog listings and search results.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog post content here..."
                          className="min-h-[300px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 pt-4">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="SEO title for search engines"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use the post title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="SEO description for search engines"
                          className="resize-none h-20"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to use the post excerpt
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="publishDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publish Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`w-full pl-3 text-left font-normal ${
                                  !field.value ? "text-muted-foreground" : ""
                                }`}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value as Date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Set a publish date for the post
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Publication Status</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-0.5">
                            <div className="font-medium">
                              {field.value ? "Published" : "Draft"}
                            </div>
                            <FormDescription>
                              {field.value
                                ? "This post is visible to the public"
                                : "This post is only visible to administrators"}
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {field.value?.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            <TagIcon className="h-3 w-3" />
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 ml-1 rounded-full"
                              onClick={() => removeTag(tag)}
                            >
                              ×
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add a tag..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          onClick={addTag}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>
                      <FormDescription>
                        Add tags to help categorize your posts
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  Preview how your blog post will look on the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md">
                  {form.watch("featuredImage") && (
                    <div className="mb-4 aspect-video rounded-md overflow-hidden bg-muted">
                      <img
                        src={form.watch("featuredImage")}
                        alt="Featured"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  )}
                  <h1 className="text-2xl font-bold mb-2">{form.watch("title") || "Post Title"}</h1>
                  <div className="flex items-center text-sm text-muted-foreground gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {form.watch("publishDate")
                        ? format(form.watch("publishDate") as Date, "PPP")
                        : "Publication Date"}
                    </div>
                    {form.watch("tags") && form.watch("tags").length > 0 && (
                      <div className="flex items-center gap-1">
                        <TagIcon className="h-4 w-4" />
                        {form.watch("tags")?.join(", ")}
                      </div>
                    )}
                    <div className="flex items-center">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {form.watch("isPublished") ? "Published" : "Draft"}
                    </div>
                  </div>
                  <p className="mb-4 italic text-sm">
                    {form.watch("excerpt") || "Post excerpt will appear here..."}
                  </p>
                  <div className="prose max-w-none border-t pt-4">
                    <p>
                      {form.watch("content")
                        ? form.watch("content").substring(0, 200) + "..."
                        : "Post content will appear here..."}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <code className="text-xs text-muted-foreground">
                      /blog/{form.watch("slug") || "post-slug"}
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/blog")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <SaveIcon className="mr-2 h-4 w-4" />
                {createMutation.isPending || updateMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Post"
                  : "Create Post"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  );
}