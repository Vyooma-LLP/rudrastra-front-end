import { createClient } from '@/utils/supabase/clients';
import { MediaStorageProvider, UploadedMedia } from './MediaStorageProvider';

export class SupabaseStorageProvider implements MediaStorageProvider {
  private getClient() {
    return createClient();
  }

  async upload(file: File): Promise<UploadedMedia> {
    const supabase = this.getClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload media: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-media')
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
      mediaType: file.type.startsWith('video/') ? 'video' : 'image', // simplified for MVP
    };
  }

  async delete(url: string): Promise<void> {
    const supabase = this.getClient();
    
    // Extract the file path from the URL
    // Public URL format: https://[project_ref].supabase.co/storage/v1/object/public/product-media/uploads/filename.jpg
    const bucketName = 'product-media';
    const urlParts = url.split(`/object/public/${bucketName}/`);
    
    if (urlParts.length === 2) {
      const filePath = urlParts[1];
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);
        
      if (error) {
        console.error('Storage delete error:', error);
        throw new Error(`Failed to delete media: ${error.message}`);
      }
    } else {
      console.warn('Could not parse file path from URL for deletion:', url);
    }
  }
}
