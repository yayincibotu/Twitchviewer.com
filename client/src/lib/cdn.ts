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