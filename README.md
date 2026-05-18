# Prostore

A full-stack e-commerce storefront built with Next.js, Prisma, and Tailwind CSS.

## Overview

`prostore` is a modern web store project featuring:

- product browsing and search
- shopping cart with session persistence
- checkout flow with shipping address, payment method, and order placement
- PayPal and Stripe payment integration
- authenticated user accounts with email/password sign-in
- admin dashboard for managing products, users, and orders
- file upload support via UploadThing
- PostgreSQL database powered by Prisma

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & ORM:** PostgreSQL (Neon) + Prisma
- **Authentication:** NextAuth.js
- **File Storage:** UploadThing
- **Payment Processing:** Stripe + PayPal Integrations
- **Testing:** Jest

## Features

- Product listing, detail pages, and search
- Cart management with guest/session cart support
- User registration and credential-based sign-in
- Order creation, payment and status tracking
- Admin pages for users, products, and orders
- Review system for products
- Server-side auth guards for protected routes
- Sample seed data for users and products

## Project Structure

- `app/` — Next.js App Router pages and layouts
- `components/` — reusable UI components
- `lib/` — helpers, actions, payment integration, constants
- `db/` — Prisma client, sample data, seed script
- `prisma/` — schema and migrations
- `app/api/` — server-side uploadthing API routes
- `tests/` — Jest test coverage

## Authentication

Authentication is managed by NextAuth with a Prisma adapter.

- credential-based sign-in is implemented in `auth.ts`
- authorization and cart session cookie handling live in `auth.config.ts`
- protected routes include checkout, profile, user orders, and admin pages

## Payments

- PayPal integration uses the sandbox API by default
- Stripe integration uses publishable and secret keys
- payment flows are handled in the order checkout and order detail pages

## Key Takeaways & Challenges

- **Cart Syncing:** Implemented complex session-to-user cart merging logic using `sessionCartId` cookies to ensure guest items aren't lost upon login.
- **Payment Webhooks:** Configured secure, asynchronous payment status updates utilizing Stripe and PayPal sandbox environments.
- **Server-Side Security:** Managed robust auth guards and middleware protection using NextAuth for sensitive admin and checkout routes.

## Notes

- Image remote loading is configured for `https://utfs.io` in `next.config.ts`
- The PayPal helper currently reads `PAYPAL_API_URL` for an optional custom endpoint
- The app uses `sessionCartId` cookie support to merge guest carts with signed-in users

## License

This repository is provided as-is for development and learning purposes.
