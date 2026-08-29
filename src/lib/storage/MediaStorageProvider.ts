export type UploadedMedia = {
  url: string;
  mediaType: string;
};

export interface MediaStorageProvider {
  upload(file: File): Promise<UploadedMedia>;
  delete(url: string): Promise<void>;
}

// Dummy local implementation for MVP since we don't have Supabase credentials yet
export class LocalStorageProvider implements MediaStorageProvider {
  async upload(file: File): Promise<UploadedMedia> {
    // In a real implementation this would upload to S3/Supabase.
    // For MVP frontend we'll use object URLs or a generic placeholder.
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          url: URL.createObjectURL(file), // Warning: Object URLs are lost on reload, a real provider is needed for production persistence.
          mediaType: file.type.startsWith('video/') ? 'video' : 'image',
        });
      }, 500);
    });
  }

  async delete(url: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 200);
    });
  }
}

// Note: To use Supabase Storage later:
// export class SupabaseStorageProvider implements MediaStorageProvider { ... }
