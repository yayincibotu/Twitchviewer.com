# TwitchViewer.com - Twitch Channel Growth SaaS Platform

A professional SaaS application for Twitch streamers to boost their channel visibility with real viewers, gain more followers, and grow their audience.

## Features

- **User Authentication**: Secure email and password-based authentication with email verification
- **Role-Based Access**: Admin dashboard for managing users, packages, and SEO settings
- **Subscription Management**: Stripe integration for handling subscriptions and payments
- **Dashboard Analytics**: Track viewer statistics, follower growth, and watch time
- **SEO Optimization**: Full SEO support with dynamic meta tags and XML sitemap generation
- **Responsive Design**: Beautiful UI that works perfectly on mobile, tablet, and desktop

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, shadcn UI components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with email verification
- **Styling**: TailwindCSS with custom theming
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query (React Query)
- **Payments**: Stripe integration

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/twitchviewer

# Session secret
SESSION_SECRET=your-session-secret

# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/twitchviewer.git
   cd twitchviewer
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the database:
   ```
   npm run db:push
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - Reusable UI components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and libraries
  - `/src/pages` - Main application pages

- `/server` - Backend Express server
  - `auth.ts` - Authentication setup
  - `routes.ts` - API route definitions
  - `storage.ts` - Database operations

- `/shared` - Shared code between frontend and backend
  - `schema.ts` - Database schema definitions and types

## Key Features

### 1. Authentication System

The application uses a secure authentication system with email verification. The first user to register is automatically assigned admin privileges.

### 2. Subscription Plans

Three subscription tiers:
- **Starter**: For new streamers, providing up to 50 viewers
- **Professional**: For established streamers, providing up to 200 viewers
- **Enterprise**: For serious streamers, providing up to 500 viewers

### 3. SEO Optimization

- Dynamic meta tags for all pages
- XML sitemap generation
- Structured content with semantic HTML

### 4. Admin Dashboard

The admin dashboard allows management of:
- Users and their roles
- Subscription packages and pricing
- SEO settings for all pages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.