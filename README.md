# StreamVault

Premium digital subscription selling platform built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and Firebase.

## What is included

- Premium SaaS-grade landing page with glassmorphism, gradients, motion, and responsive sections
- Product catalog with search, filters, animated cards, and plan detail views
- Firebase Auth login and secure server-side session cookies
- Manual catalog management with wallet purchases and a clean base for future USDT gateway integration
- Firestore-backed orders, subscriptions, coupons, analytics, and OTT account assignment
- Admin workspace for analytics, products, coupons, orders, and credential vault management
- AES-encrypted OTT credentials, Firestore rules, and Storage rules
- Deployment-ready structure for Vercel + Firebase

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Firebase Auth, Firestore, Storage, Admin SDK
- Future USDT gateway (manual integration later)
- Zustand
- Zod

## Setup

1. Install Node.js 20+ and npm 10+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Fill all Firebase values.
5. Start the app with `npm run dev`.

## Environment variables

### Frontend Firebase

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
### Server secrets

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `SESSION_COOKIE_NAME`
- `SESSION_COOKIE_MAX_AGE`
- `OTT_CREDENTIAL_SECRET`

## Firebase collections

- `users`
- `categories`
- `products`
- `orders`
- `subscriptions`
- `coupons`
- `ottAccounts`
- `orderFulfillments`

## Admin bootstrap

1. Create a user via the login/register screen.
2. In Firestore, update that user document role to `admin`.
3. Add category documents first.
4. Add products and OTT accounts from `/admin`.

## Catalog notes

- The app no longer auto-seeds starter categories or products.
- Use the admin dashboard to add your catalog manually.
- Use the admin dashboard clear action if you want to wipe catalog-side data and start fresh again.

## Deployment

### Vercel

1. Import the project into Vercel.
2. Set all environment variables.
3. Build command: `npm run build`

### Firebase

- Deploy Firestore rules with `firebase deploy --only firestore:rules`
- Deploy Storage rules with `firebase deploy --only storage`

## Notes

- OTP auth is optional and can be layered in later using Firebase phone auth.
- Add Firestore composite indexes as prompted in production for filtered `orders` and `subscriptions` queries.
- Product images can be uploaded to Firebase Storage and then stored as public download URLs in product records.
