-- Custom Migration: Storage Baseline
-- Extracted from Production to establish Canonical Parity

-- 1. Ensure product-media bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Ensure products legacy bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- 3. product-media canonical RLS (from Production)
-- Drop existing policies if any to ensure clean state
DROP POLICY IF EXISTS "Public read access for product media" ON storage.objects;
DROP POLICY IF EXISTS "Admin/Ops can insert product media" ON storage.objects;
DROP POLICY IF EXISTS "Admin/Ops can update product media" ON storage.objects;
DROP POLICY IF EXISTS "Admin/Ops can delete product media" ON storage.objects;

-- We also drop any staging 'authenticated' policies to clean up any permissive rules
DROP POLICY IF EXISTS "Authenticated users can upload product media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product media" ON storage.objects;

-- Recreate Production Canonical Policies
CREATE POLICY "Public read access for product media" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'product-media');

CREATE POLICY "Admin/Ops can insert product media" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'product-media' AND get_user_role(auth.uid()) IN ('ADMIN', 'OPS'));

CREATE POLICY "Admin/Ops can update product media" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'product-media' AND get_user_role(auth.uid()) IN ('ADMIN', 'OPS'));

CREATE POLICY "Admin/Ops can delete product media" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'product-media' AND get_user_role(auth.uid()) IN ('ADMIN', 'OPS'));

-- 4. products legacy bucket transition (Read-Only)
-- Drop all policies on the legacy products bucket to prevent any new writes
DROP POLICY IF EXISTS "Public read access for products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update products" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON storage.objects;

-- Recreate only the read policy
CREATE POLICY "Public read access for products" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'products');

-- No insert/update/delete policies are created for 'products', enforcing strict read-only behavior at the DB level.
