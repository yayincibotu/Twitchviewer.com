import { useState, useEffect } from "react";
import { 
  ImageIcon, 
  Upload, 
  X, 
  Search, 
  FileImage, 
  Trash2, 
  Copy,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

interface MediaLibraryProps {
  onSelect: (url: string) => void;
  buttonVariant?: "default" | "outline" | "secondary";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonLabel?: string;
  selectedMedia?: string;
}

export default function MediaLibrary({
  onSelect,
  buttonVariant = "outline",
  buttonSize = "icon",
  buttonLabel,
  selectedMedia
}: MediaLibraryProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(selectedMedia || null);

  // Reset states when dialog is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setUploadProgress(0);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  // Fetch media
  const { data: media, isLoading, refetch } = useQuery<Media[]>({
    queryKey: ['/api/media'],
    enabled: isOpen,
  });

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      
      const promise = new Promise<Media>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            setUploadProgress(progress);
          }
        });
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        
        xhr.onerror = function() {
          reject(new Error("Network error during upload"));
        };
        
        xhr.open("POST", "/api/media/upload");
        xhr.send(formData);
      });
      
      return promise;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/media'] });
      toast({
        title: "Upload successful",
        description: `${data.filename} has been uploaded.`,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      setSelectedImageUrl(data.url);
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
      // If the selected media was deleted, clear the selection
      if (selectedImageUrl && !media?.find(m => m.url === selectedImageUrl)) {
        setSelectedImageUrl(null);
      }
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

  // Copy url to clipboard
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "URL copied",
          description: "The URL has been copied to your clipboard.",
          duration: 2000,
        });
      },
      (err) => {
        toast({
          title: "Failed to copy",
          description: "Could not copy the URL.",
          variant: "destructive",
        });
      }
    );
  };

  // Confirm selection and close dialog
  const confirmSelection = () => {
    if (selectedImageUrl) {
      onSelect(selectedImageUrl);
      setIsOpen(false);
    } else {
      toast({
        title: "No image selected",
        description: "Please select an image first.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          {buttonSize === "icon" ? (
            <ImageIcon className="h-4 w-4" />
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              {buttonLabel || "Media Library"}
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
          <DialogDescription>
            Browse and manage your media files or upload new ones.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="browse">Browse</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            
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

          <TabsContent value="browse" className="flex-1 overflow-hidden flex flex-col mt-0">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pb-4 pr-2">
                {filteredMedia.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`overflow-hidden cursor-pointer border-2 transition ${
                      selectedImageUrl === item.url 
                        ? "border-primary" 
                        : "border-transparent hover:border-muted"
                    }`}
                    onClick={() => setSelectedImageUrl(item.url)}
                  >
                    {item.mimeType.startsWith("image/") ? (
                      <div className="aspect-square relative group">
                        <img
                          src={item.url}
                          alt={item.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(item.url, '_blank');
                                  }}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Open in new tab</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(item.url);
                                  }}
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
                                <Button 
                                  size="icon" 
                                  variant="outline" 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm(`Are you sure you want to delete ${item.filename}?`)) {
                                      deleteMutation.mutate(item.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
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
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
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
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                {previewUrl ? (
                  <div className="relative mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full max-h-64 rounded"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg p-8 mb-4">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground mt-2">
                      Drag and drop a file here, or click to select a file
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2 w-full max-w-md">
                  <Label htmlFor="file-upload">
                    {selectedFile ? "Replace file" : "Select file"}
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  
                  {selectedFile && (
                    <div className="text-sm text-muted-foreground mt-2">
                      <div>Name: {selectedFile.name}</div>
                      <div>Size: {formatFileSize(selectedFile.size)}</div>
                      <div>Type: {selectedFile.type}</div>
                    </div>
                  )}

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="w-full bg-muted h-2 rounded-full mt-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      if (selectedFile) {
                        uploadMutation.mutate(selectedFile);
                      }
                    }}
                    disabled={!selectedFile || uploadMutation.isPending}
                    className="mt-2"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirmSelection} disabled={!selectedImageUrl}>
            {selectedImageUrl ? "Select" : "Choose an image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}