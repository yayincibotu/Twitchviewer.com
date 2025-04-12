import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  RefreshCw,
  Search,
  FileImage,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Media {
  id: number;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch media
  const { data: media, isLoading, refetch } = useQuery<Media[]>({
    queryKey: ['/api/media'],
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      return new Promise<void>((resolve, reject) => {
        xhr.open("POST", "/api/media", true);
        xhr.withCredentials = true;
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(xhr.statusText || "Upload failed"));
          }
        };
        
        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };
        
        xhr.send(formData);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded.",
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Media deleted",
        description: "The media has been successfully deleted.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete media",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter media based on search query
  const filteredMedia = media?.filter(
    (item) =>
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "The file URL has been copied to clipboard.",
    });
  };

  return (
    <AdminLayout title="Media Library" description="Upload and manage media files">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Media Library</h1>
          <div className="flex gap-2">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search media..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Upload Card */}
          <Card className="col-span-1">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="font-medium">Upload New File</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex">
                    <Label htmlFor="file-upload" className="sr-only">
                      Upload file
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="w-full"
                      onChange={handleFileChange}
                    />
                  </div>

                  {previewUrl && (
                    <div className="aspect-square bg-muted/30 relative rounded-md overflow-hidden border">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {selectedFile && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {selectedFile.name} ({formatFileSize(selectedFile.size)})
                      </p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    disabled={!selectedFile || uploadMutation.isPending}
                    onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
                  >
                    {uploadMutation.isPending ? (
                      <>
                        <div className="mr-2">Uploading... {uploadProgress}%</div>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Grid */}
          <div className="col-span-1 md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square w-full" />
                    <CardContent className="p-3">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMedia && filteredMedia.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((item) => (
                  <Card 
                    key={item.id} 
                    className="overflow-hidden"
                  >
                    {item.mimeType.startsWith("image/") ? (
                      <div className="aspect-square relative group">
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Error";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="secondary" 
                                  size="icon"
                                  onClick={() => copyToClipboard(item.url)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Copy URL</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon">
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="center">
                                    <DropdownMenuItem onClick={() => window.open(item.url, '_blank')}>
                                      Open in New Tab
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TooltipTrigger>
                              <TooltipContent>Actions</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="icon"
                                  onClick={() => deleteMutation.mutate(item.id)}
                                  disabled={deleteMutation.isPending}
                                >
                                  {deleteMutation.isPending ? (
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-muted">
                        <FileImage className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <CardContent className="p-3">
                      <div className="truncate font-medium text-sm">
                        {item.filename}
                      </div>
                      <div className="text-xs text-muted-foreground flex justify-between">
                        <span>{formatFileSize(item.size)}</span>
                        {item.width && item.height && (
                          <span>{item.width}×{item.height}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <FileImage className="h-12 w-12 mb-2" />
                <p>{searchQuery ? "No media found" : "No media available"}</p>
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    className="mt-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}