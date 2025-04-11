import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import fetch from "node-fetch";

// Twitch OAuth yeniden yönlendirme URL'i
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI || 'http://localhost:5000/api/auth/twitch/callback';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}



// Şifre sıfırlama tokenı oluşturma
function generatePasswordResetToken(): string {
  return randomBytes(32).toString('hex');
}

// Cloudflare Turnstile doğrulama
async function verifyTurnstile(token: string): Promise<boolean> {
  // Geçici olarak Turnstile doğrulamasını atlıyoruz
  console.log('Turnstile doğrulaması geçici olarak devre dışı bırakıldı');
  return true;
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "twitchviewer-session-secret",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, password, turnstileToken } = req.body;
      
      // Turnstile doğrulaması geçici olarak devre dışı bırakıldı
      /*
      // Verify Turnstile Token
      if (!turnstileToken) {
        return res.status(400).json({ message: "Turnstile verification required" });
      }
      
      const isValidTurnstile = await verifyTurnstile(turnstileToken);
      if (!isValidTurnstile) {
        return res.status(400).json({ message: "Turnstile verification failed" });
      }
      */
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        username,
        email,
        password: hashedPassword,
      });

      // In a real app, we would send an email verification here
      // For now, let's just auto-verify the first created user and make them admin
      const isFirstUser = user.id == 1; // Using == to avoid type issues
      if (isFirstUser) {
        await storage.verifyUserEmail(user.id);
        await storage.updateUserRole(user.id, "admin");
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json({ 
          id: user.id, 
          username: user.username, 
          email: user.email, 
          emailVerified: user.emailVerified,
          role: user.role
        });
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", async (req, res, next) => {
    try {
      const { turnstileToken } = req.body;
      
      // Turnstile doğrulaması geçici olarak devre dışı bırakıldı
      /*
      // Verify Turnstile Token
      if (!turnstileToken) {
        return res.status(400).json({ message: "Turnstile verification required" });
      }
      
      const isValidTurnstile = await verifyTurnstile(turnstileToken);
      if (!isValidTurnstile) {
        return res.status(400).json({ message: "Turnstile verification failed" });
      }
      */
      
      // Continue with passport authentication
      passport.authenticate("local", (err: Error | null, user: SelectUser | false) => {
        if (err) {
          return next(err);
        }
        
        if (!user) {
          return res.status(401).json({ message: "Invalid username or password" });
        }
        
        req.login(user, (loginErr) => {
          if (loginErr) {
            return next(loginErr);
          }
          
          // Don't send the password back to the client
          const { password, ...userWithoutPassword } = user;
          res.status(200).json(userWithoutPassword);
        });
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    // Don't send the password back to the client
    const { password, ...userWithoutPassword } = req.user as SelectUser;
    res.json(userWithoutPassword);
  });

  // Email verification endpoint (would typically be triggered via email link)
  app.post("/api/verify-email", async (req, res, next) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Not authenticated" });
    
    try {
      const userId = (req.user as SelectUser).id;
      const updatedUser = await storage.verifyUserEmail(userId);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send the password back to the client
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });

  // Password reset request
  app.post("/api/request-password-reset", async (req, res, next) => {
    try {
      const { email, turnstileToken } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Turnstile doğrulaması geçici olarak devre dışı bırakıldı
      /*
      // Verify Turnstile Token
      if (!turnstileToken) {
        return res.status(400).json({ message: "Turnstile verification required" });
      }
      
      const isValidTurnstile = await verifyTurnstile(turnstileToken);
      if (!isValidTurnstile) {
        return res.status(400).json({ message: "Turnstile verification failed" });
      }
      */
      
      const resetTokenData = await storage.setPasswordResetToken(email);
      
      if (!resetTokenData) {
        // Don't reveal if the email exists or not for security reasons
        return res.status(200).json({ message: "If that email is registered, we'll send password reset instructions" });
      }
      
      // In a real application, we would send an email with a link containing the token
      // For demonstration purposes, we'll just return success
      res.status(200).json({ 
        message: "Password reset instructions sent to your email",
        // In a real app, don't send the token directly - this is just for testing
        debug: process.env.NODE_ENV === "development" ? { token: resetTokenData.token } : undefined
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Reset password with token
  app.post("/api/reset-password", async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }
      
      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Try to reset the password
      const user = await storage.resetPassword(token, hashedPassword);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }
      
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      next(error);
    }
  });
  
  // Remember session setting
  app.post("/api/remember-session", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = (req.user as SelectUser).id;
      const { remember } = req.body;
      
      if (typeof remember !== 'boolean') {
        return res.status(400).json({ message: "Remember parameter must be a boolean" });
      }
      
      const updatedUser = await storage.updateRememberedSession(userId, remember);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update session cookie expiration time
      if (req.session) {
        if (remember) {
          // Set session to expire in 30 days
          req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else {
          // Set session to expire when browser is closed (browser session)
          req.session.cookie.maxAge = undefined;
        }
      }
      
      // Don't send the password back to the client
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  });
  
  // Twitch OAuth routes
  app.get("/api/auth/twitch", (req, res) => {
    if (!process.env.TWITCH_CLIENT_ID) {
      return res.status(500).json({ message: "Twitch client ID not configured" });
    }
    
    // Generate a random state value for CSRF protection
    const state = randomBytes(16).toString("hex");
    // Type-safe way to store state in session
    if (req.session) {
      (req.session as any).oauthState = state;
    }
    
    // Construct Twitch OAuth URL
    const twitchAuthUrl = new URL("https://id.twitch.tv/oauth2/authorize");
    twitchAuthUrl.searchParams.append("client_id", process.env.TWITCH_CLIENT_ID);
    twitchAuthUrl.searchParams.append("redirect_uri", `${req.protocol}://${req.get('host')}/api/auth/twitch/callback`);
    twitchAuthUrl.searchParams.append("response_type", "code");
    twitchAuthUrl.searchParams.append("scope", "user:read:email");
    twitchAuthUrl.searchParams.append("state", state);
    
    res.redirect(twitchAuthUrl.toString());
  });
  
  app.get("/api/auth/twitch/callback", async (req, res, next) => {
    try {
      const { code, state } = req.query;
      
      // Verify state parameter to prevent CSRF
      if (!state || !req.session || !(req.session as any).oauthState || state !== (req.session as any).oauthState) {
        return res.status(400).json({ message: "Invalid state parameter" });
      }
      
      // Clear the state from session
      if (req.session) {
        delete (req.session as any).oauthState;
      }
      
      if (!code) {
        return res.status(400).json({ message: "Authorization code not provided" });
      }
      
      if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
        return res.status(500).json({ message: "Twitch credentials not configured" });
      }
      
      // Exchange code for token
      const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
          code: code as string,
          grant_type: "authorization_code",
          redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/twitch/callback`,
        }),
      });
      
      if (!tokenResponse.ok) {
        return res.status(400).json({ message: "Failed to exchange code for token" });
      }
      
      const tokenData = await tokenResponse.json() as { 
        access_token: string; 
        refresh_token: string;
      };
      
      // Get user data from Twitch
      const userResponse = await fetch("https://api.twitch.tv/helix/users", {
        headers: {
          "Authorization": `Bearer ${tokenData.access_token}`,
          "Client-Id": process.env.TWITCH_CLIENT_ID,
        },
      });
      
      if (!userResponse.ok) {
        return res.status(400).json({ message: "Failed to fetch user data from Twitch" });
      }
      
      const userData = await userResponse.json() as { 
        data: [{ 
          id: string; 
          login: string; 
          email: string; 
        }] 
      };
      
      // Check if data array is empty
      if (!userData.data || !userData.data.length) {
        return res.status(400).json({ message: "No user data returned from Twitch" });
      }
      
      const twitchUser = userData.data[0];
      
      // Create or update user in our system
      const user = await storage.createOrUpdateTwitchUser({
        twitchId: twitchUser.id,
        username: twitchUser.login,
        email: twitchUser.email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
      });
      
      // Log the user in
      req.login(user, (err) => {
        if (err) return next(err);
        res.redirect('/');
      });
    } catch (error) {
      next(error);
    }
  });
}
