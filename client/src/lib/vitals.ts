/**
 * Web Vitals ölçümleri için yapılandırma
 */
import { onCLS, onFID, onLCP, onTTFB, onFCP, type Metric } from 'web-vitals';

/**
 * Web Vitals metrikleri için dönüşüm fonksiyonu
 * @param metric Web Vitals metriği
 */
function sendToAnalytics(metric: Metric) {
  // Metrikleri JSON olarak dönüştür
  const body = JSON.stringify(metric);
  
  // Metrics endpoint'e gönder (eğer navigator.sendBeacon varsa)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', body);
  } else {
    // Fallback olarak fetch API kullan
    fetch('/api/metrics', {
      body,
      method: 'POST',
      keepalive: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  // Geliştirme ortamında console'a yaz
  if (process.env.NODE_ENV !== 'production') {
    console.log('Web Vitals:', metric);
  }
}

/**
 * Web Vitals izlemeyi başlatır
 */
export function reportWebVitals() {
  onCLS(sendToAnalytics); // Cumulative Layout Shift
  onFID(sendToAnalytics); // First Input Delay
  onLCP(sendToAnalytics); // Largest Contentful Paint
  onTTFB(sendToAnalytics); // Time to First Byte
  onFCP(sendToAnalytics); // First Contentful Paint
}