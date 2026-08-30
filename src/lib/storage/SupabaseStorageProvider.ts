import { createClient } from '@/utils/supabase/clients';
import { MediaStorageProvider, UploadedMedia } from './MediaStorageProvider';
import * as tus from 'tus-js-client';

export class SupabaseStorageProvider implements MediaStorageProvider {
  private getClient() {
    return createClient();
  }

  async upload(file: File, onProgress?: (progress: number) => void): Promise<UploadedMedia> {
    const supabase = this.getClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;
    const bucketName = 'product-media';

    let defaultMediaType = 'image';
    if (file.name.match(/\.(step|stp|stl|iges|igs)$/i)) defaultMediaType = 'cad';
    else if (file.name.match(/\.(pdf|csv|xlsx|json|doc|docx)$/i)) defaultMediaType = 'document';
    else if (file.type.startsWith('video/')) defaultMediaType = 'video';

    // File size threshold for TUS (6MB)
    if (file.size > 6 * 1024 * 1024) {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Authentication required for large uploads");
      
      return new Promise((resolve, reject) => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        let projectId = '';
        try {
          projectId = new URL(supabaseUrl).hostname.split('.')[0];
        } catch (e) {
          console.warn("Could not parse supabase URL");
        }
        const tusEndpoint = projectId 
          ? `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`
          : `${supabaseUrl}/storage/v1/upload/resumable`;

        const upload = new tus.Upload(file, {
          endpoint: tusEndpoint,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${session.access_token}`,
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: bucketName,
            objectName: filePath,
            contentType: file.type || 'application/octet-stream',
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024, 
          onError: function (error) {
            console.error('Storage upload error (TUS):', error);
            reject(new Error(`Failed to upload media: ${error.message || error}`));
          },
          onProgress: function (bytesUploaded, bytesTotal) {
            if (onProgress) {
              onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
            }
          },
          onSuccess: function () {
            const { data: publicUrlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filePath);

            resolve({
              url: publicUrlData.publicUrl,
              mediaType: defaultMediaType,
            });
          },
        });
        
        upload.start();
      });
    } else {
      // Standard upload
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error('Storage upload error:', error);
        throw new Error(`Failed to upload media: ${error.message}`);
      }
      
      if (onProgress) onProgress(100);

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        url: publicUrlData.publicUrl,
        mediaType: defaultMediaType,
      };
    }
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
