-- Create the product-media bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-media', 
    'product-media', 
    true, 
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'model/stl', 'model/step']::text[]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'model/stl', 'model/step']::text[];

-- Enable RLS on storage.objects is skipped because supabase handles it


-- 1. Public Read Access for published product media
DROP POLICY IF EXISTS "Public read access for product media" ON storage.objects;
CREATE POLICY "Public read access for product media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-media');

-- 2. ADMIN / OPS can upload, update, and delete
-- To do this safely without exposing public.users to the anon/authenticated roles directly,
-- we use a SECURITY DEFINER function.
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

DROP POLICY IF EXISTS "Admin/Ops can insert product media" ON storage.objects;
CREATE POLICY "Admin/Ops can insert product media" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'product-media' AND 
    public.get_user_role(auth.uid()) IN ('ADMIN', 'OPS')
);

DROP POLICY IF EXISTS "Admin/Ops can update product media" ON storage.objects;
CREATE POLICY "Admin/Ops can update product media" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'product-media' AND 
    public.get_user_role(auth.uid()) IN ('ADMIN', 'OPS')
);

DROP POLICY IF EXISTS "Admin/Ops can delete product media" ON storage.objects;
CREATE POLICY "Admin/Ops can delete product media" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'product-media' AND 
    public.get_user_role(auth.uid()) IN ('ADMIN', 'OPS')
);
