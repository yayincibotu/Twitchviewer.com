/**
 * CDN yapılandırması için yardımcı fonksiyonlar
 */

// CDN URL'ını yapılandırın
export const CDN_URL = process.env.NODE_ENV === 'production'
  ? 'https://twitchviewer-i1qvb.b-cdn.net'
  : '';

/**
 * Bir asset URL'ını CDN URL'ına dönüştürür
 * @param path Asset yolu (örn. '/images/logo.webp')
 * @returns CDN URL'ı ile birleştirilmiş tam URL
 */
export function cdnUrl(path: string): string {
  // Path zaten tam bir URL ise, doğrudan döndürün
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Path / ile başlamıyorsa ekleyin
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // CDN URL'ı ile birleştirin
  return `${CDN_URL}${normalizedPath}`;
}

/**
 * Resim URL'ını resim işleme parametreleriyle yapılandırır
 * @param path Resim yolu
 * @param options Resim işleme seçenekleri
 * @returns İşlenmiş resim URL'ı
 */
export function imageUrl(path: string, options?: {
  width?: number;        // Genişlik
  height?: number;       // Yükseklik
  quality?: number;      // Kalite (1-100)
  format?: 'webp' | 'jpeg' | 'png' | 'avif'; // Format
  blur?: number;         // Bulanıklık (0-100)
  grayscale?: boolean;   // Gri tonlama
  crop?: boolean;        // Kırpma
}): string {
  // Önce CDN URL'ı oluştur
  let url = cdnUrl(path);
  
  // Seçenek yoksa doğrudan URL'ı döndür
  if (!options) return url;
  
  // URL parametreleri için sorgular
  const params: string[] = [];
  
  // Parametreleri ekle
  if (options.width) params.push(`width=${options.width}`);
  if (options.height) params.push(`height=${options.height}`);
  if (options.quality) params.push(`quality=${Math.min(Math.max(options.quality, 1), 100)}`);
  if (options.format) params.push(`format=${options.format}`);
  if (options.blur) params.push(`blur=${Math.min(Math.max(options.blur, 0), 100)}`);
  if (options.grayscale) params.push('grayscale=true');
  if (options.crop) params.push('crop=true');
  
  // Parametreler varsa bunları URL'a ekle
  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }
  
  return url;
}

/**
 * Duyarlı resim kaynakları oluşturur (srcset)
 * @param path Resim yolu
 * @param options Srcset seçenekleri
 * @returns Srcset dizesi
 */
export function generateSrcSet(path: string, options?: {
  widths?: number[];        // Genişlik varyasyonları
  format?: 'webp' | 'jpeg' | 'png' | 'avif'; // Format
  quality?: number;         // Kalite
}): string {
  // Varsayılan genişlikler
  const widths = options?.widths || [320, 480, 640, 768, 1024, 1280, 1536];
  const format = options?.format || 'webp';
  const quality = options?.quality || 80;
  
  // Her genişlik için URL oluştur
  return widths.map(width => {
    const url = imageUrl(path, { width, format, quality });
    return `${url} ${width}w`;
  }).join(', ');
}

/**
 * SEO için optimize edilmiş resim nesnesi oluşturur
 * @param path Resim yolu
 * @param alt Alt metni
 * @param options Seçenekler
 * @returns Resim nesnesi
 */
export function optimizedImage(path: string, alt: string, options?: {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  quality?: number;
  lazy?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}): {
  src: string;
  srcSet: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  className?: string;
  sizes?: string;
  fetchPriority?: 'high' | 'auto';
} {
  const format = options?.format || 'webp';
  const quality = options?.quality || 80;
  const src = imageUrl(path, { 
    width: options?.width,
    height: options?.height,
    format,
    quality
  });
  
  const srcSet = generateSrcSet(path, {
    format,
    quality
  });
  
  return {
    src,
    srcSet,
    alt,
    width: options?.width,
    height: options?.height,
    loading: options?.lazy === false ? 'eager' : 'lazy',
    className: options?.className,
    sizes: options?.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    fetchPriority: options?.priority ? 'high' : 'auto'
  };
}