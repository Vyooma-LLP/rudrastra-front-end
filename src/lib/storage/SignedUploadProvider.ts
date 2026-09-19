import { MediaStorageProvider, UploadedMedia } from './MediaStorageProvider';
import { generateSignedUploadUrl } from '@/app/actions/upload';
import * as tus from 'tus-js-client';

export class SignedUploadProvider implements MediaStorageProvider {
  private context?: { productId?: string; variantId?: string };

  constructor(context?: { productId?: string; variantId?: string }) {
    this.context = context;
  }

  async upload(file: File, onProgress?: (progress: number) => void): Promise<UploadedMedia> {
    const fileExt = file.name.split('.').pop();
    
    let defaultMediaType = 'image';
    if (file.name.match(/\.(step|stp|stl|iges|igs)$/i)) defaultMediaType = 'cad';
    else if (file.name.match(/\.(pdf|csv|xlsx|json|doc|docx)$/i)) defaultMediaType = 'document';
    else if (file.type.startsWith('video/')) defaultMediaType = 'video';

    // 1. Request Signed Upload URL from Server Action
    const { signedUrl, path, token, fullUrl } = await generateSignedUploadUrl(
      file.name,
      file.type || 'application/octet-stream',
      this.context
    );

    // File size threshold for TUS (6MB)
    if (file.size > 6 * 1024 * 1024) {
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
            authorization: `Bearer ${token}`, // Use the generated token from Server Action
            'x-upsert': 'true',
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: 'product-media',
            objectName: path,
            contentType: file.type || 'application/octet-stream',
            cacheControl: '3600',
          },
          chunkSize: 6 * 1024 * 1024, 
          onError: function (error) {
            console.error('Storage upload error (TUS):', error);
            reject(new Error(`Failed to upload media via signed url: ${error.message || error}`));
          },
          onProgress: function (bytesUploaded, bytesTotal) {
            if (onProgress) {
               onProgress(Math.round((bytesUploaded / bytesTotal) * 100));
            }
          },
          onSuccess: function () {
            resolve({
              url: fullUrl,
              mediaType: defaultMediaType,
            });
          },
        });
        
        upload.start();
      });
    } else {
      // Standard upload using signed URL via PUT request
      const response = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to upload to signed URL: ${response.statusText}`);
      }

      if (onProgress) onProgress(100);

      return {
        url: fullUrl,
        mediaType: defaultMediaType,
      };
    }
  }

  async delete(url: string): Promise<void> {
    // Note: Deletions would also require a secure Server Action.
    // Sellers should not be able to delete arbitrary assets.
    // We would implement `deleteSignedAsset` server action here in the future.
    console.warn("Delete functionality via SignedUploadProvider requires a corresponding Server Action");
  }
}
