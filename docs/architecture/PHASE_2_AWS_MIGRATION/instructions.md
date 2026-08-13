# Phase 2 AWS Migration Plan

## 1. Overview
Currently, the Rudrastra application runs on a Next.js (App Router) monolithic architecture using Supabase for PostgreSQL, Authentication, and Row Level Security (RLS). 

As we hit higher scale and security requirements for enterprise defense contractors, we will migrate from Supabase to a native AWS architecture.

## 2. Infrastructure Targets
- **Database:** Supabase PostgreSQL -> AWS RDS (PostgreSQL)
- **Authentication:** Supabase Auth -> AWS Cognito
- **Storage:** Supabase Storage (if used) -> AWS S3
- **Compute/Hosting:** Vercel -> AWS Fargate / ECS / App Runner

## 3. Step-by-Step Migration Strategy

### Phase 2A: Authentication (Supabase Auth -> AWS Cognito)
1. **Provision AWS Cognito User Pools & Identity Pools.**
2. **Adapter Replacement:**
   - Modify the Next.js frontend to use `amazon-cognito-identity-js` or `aws-amplify` auth instead of `@supabase/ssr`.
   - Update `SupabaseAuthAdapter.ts` to `CognitoAuthAdapter.ts`.
3. **Data Migration:** Use a custom script to export users from `auth.users` in Supabase and import them into Cognito (passwords will require a force-reset workflow or custom auth challenge if hashes aren't compatible).
4. **JWT Verification:** Update API routes (e.g., `/api/cart`, `/api/auth/session`) to verify Cognito JWTs instead of Supabase JWTs.

### Phase 2B: Database (Supabase Postgres -> AWS RDS Postgres)
1. **Provision AWS RDS PostgreSQL Multi-AZ Instance.**
2. **Schema Migration:** 
   - Since we are using Drizzle ORM, we can point `drizzle.config.ts` to the new RDS connection string.
   - Run `npx drizzle-kit push` to create the schema on RDS.
3. **Data Migration:**
   - Use AWS DMS (Database Migration Service) or `pg_dump/pg_restore` to migrate `public` schema tables (`users`, `sellers`, `products`, `cart_items`) from Supabase to RDS.
4. **RLS Replacement:**
   - Supabase relies heavily on RLS enforced via the DB connection and JWT claims.
   - In RDS, we must enforce authorization at the application layer (API Routes) or construct a custom tenant-context wrapper for Postgres if we intend to keep database-level RLS.

### Phase 2C: Storage & Object Hosting (S3)
1. If any product images are stored in Supabase Storage, migrate them to an S3 Bucket.
2. Update Image components to point to CloudFront distributions in front of S3.

## 4. Required Codebase Changes
- Remove `@supabase/supabase-js` and `@supabase/ssr`.
- Install `aws-sdk` / `@aws-sdk/client-cognito-identity-provider`.
- Deprecate `/utils/supabase/server.ts` and replace it with `/utils/aws/cognito.ts`.
- Ensure all API routes validate session via Cognito instead of Supabase's `getUser()`.

## 5. Security Posture
- All DB connections to RDS will use IAM authentication or Secrets Manager.
- Ensure the database is placed in a private subnet, accessed via a Bastion Host or securely peered VPC if Vercel is still used.
- All secrets moved to AWS Secrets Manager or Parameter Store.
