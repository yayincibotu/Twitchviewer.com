import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import compression from "compression";

const app = express();

// Güvenlik başlıkları
app.use((req, res, next) => {
  // Güvenlik başlıkları ekle
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  // Referrer politikası
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https://twitchviewer-i1qvb.b-cdn.net; " +
    "font-src 'self'; " +
    "connect-src 'self' https://api.stripe.com; " +
    "frame-src https://js.stripe.com; " +
    "object-src 'none'; " +
    "base-uri 'self';"
  );
  
  next();
});

// Gzip/Brotli sıkıştırma yapılandırması - agresif sıkıştırma seviyesi ile 
app.use(compression({
  level: 6, // Sıkıştırma seviyesi (0-9)
  threshold: 0, // Sıkıştırmanın uygulanacağı minimum boyut
  filter: (req, res) => {
    // Statik dosyalar, API yanıtları vb. için sıkıştırma uygulayın
    // WebSocket veya event-stream yanıtları için uygulamayın
    if (req.headers['accept-encoding']?.includes('gzip')) {
      return true;
    }
    return compression.filter(req, res);
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Serve static files from client/public directory with cache headers
  app.use(express.static('client/public', {
    maxAge: '1y',
    setHeaders: (res, path) => {
      // Statik varlıklar için agresif önbelleğe alma (1 yıl)
      if (path.endsWith('.js') || path.endsWith('.css') || 
          path.endsWith('.webp') || path.endsWith('.woff2') ||
          path.endsWith('.png') || path.endsWith('.jpg') || 
          path.endsWith('.jpeg') || path.endsWith('.svg') ||
          path.endsWith('.ico') || path.endsWith('.ttf')) {
        // Immutable flag güçlü önbelleğe alma için eklendi
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else {
        // Diğer dosyalar için daha kısa süre (1 hafta)
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
      
      // Resim dosyaları için content-type ve boyut optimizasyonları
      if (path.endsWith('.webp')) {
        res.setHeader('Content-Type', 'image/webp');
      }
    }
  }));
  
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
