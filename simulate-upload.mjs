import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tqolbhkqxsccsxsvhxgh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxb2xiaGtxeHNjY3N4c3ZoeGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwNDAwMjMsImV4cCI6MjEwMzYxNjAyM30.80Ck7bAA4xpi1XlSnzhjIE3mWyHElOIWEic5HPoE6QY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing upload...");
  // Simulate a file using a Blob
  const fileContent = new Blob(['test image content'], { type: 'image/png' });
  
  const { data, error } = await supabase.storage
    .from('product-media')
    .upload('uploads/test-upload.png', fileContent, {
      contentType: 'image/png',
      upsert: false
    });

  if (error) {
    console.error("Upload error:", error);
  } else {
    console.log("Upload success:", data);
  }
}

test();
