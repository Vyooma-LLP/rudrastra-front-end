-- Custom SQL migration file, put your code below! 

-- Create a function to handle new users from Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    role_val text;
    full_name_val text;
    company_name_val text;
    gstin_val text;
BEGIN
    -- Extract values from user_metadata with fallbacks
    full_name_val := COALESCE(new.raw_user_meta_data->>'full_name', 'Unknown User');
    company_name_val := new.raw_user_meta_data->>'company_name';
    gstin_val := new.raw_user_meta_data->>'gstin';
    role_val := COALESCE(new.raw_user_meta_data->>'role', 'CUSTOMER');

    -- Clamp role for security: Only CUSTOMER or SELLER are allowed via metadata.
    -- Admin roles MUST be set manually via secure server logic.
    IF role_val NOT IN ('CUSTOMER', 'SELLER') THEN
        role_val := 'CUSTOMER';
    END IF;

    -- If gstin is empty string, convert to null
    IF gstin_val = '' THEN
        gstin_val := NULL;
    END IF;

    -- Insert into public.users
    INSERT INTO public.users (
        id,
        email,
        full_name,
        company_name,
        gstin,
        role,
        created_at
    ) VALUES (
        new.id,
        new.email,
        full_name_val,
        company_name_val,
        gstin_val,
        role_val,
        COALESCE(new.created_at, NOW())
    );

    -- Insert into public.sellers if role is SELLER
    IF role_val = 'SELLER' THEN
        INSERT INTO public.sellers (
            user_id,
            store_name,
            created_at
        ) VALUES (
            new.id,
            COALESCE(company_name_val, full_name_val, 'Store'),
            COALESCE(new.created_at, NOW())
        );
    END IF;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();