import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Loader2, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string | null;
  authorId: number | null;
  tags: string[] | null;
  publishDate: string;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
};

export default function BlogPreviewSection() {
  const [, setLocation] = useLocation();
  
  // En son blog yazılarını çek (sadece yayınlananlar)
  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts'],
  });
  
  if (isLoading) {
    return (
      <div className="py-8 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    );
  }
  
  // Eğer blog yazısı yoksa veya hata oluştuysa bileşeni gösterme
  if (error || !posts || posts.length === 0) {
    return null;
  }
  
  // Son 3 blog yazısını al
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <section className="py-16 bg-white" id="blog">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">Blog & Kaynaklar</h2>
            <p className="text-neutral-600 max-w-2xl">
              Twitch yayıncılığı, izleyici kazanımı ve kanal büyütme ile ilgili en son makaleleri ve ipuçlarını keşfedin.
            </p>
          </div>
          
          <Button 
            variant="outline"
            className="mt-4 md:mt-0"
            onClick={() => setLocation("/blog")}
          >
            Tüm yazıları görüntüle <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <div 
              key={post.id}
              className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {post.featuredImage && (
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.featuredImage} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              
              <div className="p-6">
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-neutral-900 mb-2 hover:text-primary transition-colors duration-300">
                  <a 
                    href={`/blog/${post.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation(`/blog/${post.slug}`);
                    }}
                  >
                    {post.title}
                  </a>
                </h3>
                
                <p className="text-neutral-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-sm text-neutral-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(post.publishDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}