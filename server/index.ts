import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import compression from "compression";

const app = express();
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
      if (path.endsWith('.js') || path.endsWith('.css') || 
          path.endsWith('.webp') || path.endsWith('.woff2')) {
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 yıl
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
