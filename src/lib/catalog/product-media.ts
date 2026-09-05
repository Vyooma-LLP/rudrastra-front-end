/**
 * Canonical product media resolver.
 * Enforces the architectural rule that `productMedia` is the single source of truth for assets,
 * with legacy `imageUrl` preserved only as an ultimate fallback for un-migrated products.
 */

export interface ResolvedProductAsset {
  url: string;
  mediaType: string;
  assetRole: string;
}

const DEFAULT_FALLBACK_IMAGE = "/images/products/rudrastra_motor_1785921295587.png";

/**
 * Resolves the primary image for a product.
 * Usage: Homepage, Catalog cards, Search, Compare, Cart, Ops preview.
 */
export function resolvePrimaryImage(product: any): ResolvedProductAsset | null {
  if (!product) return null;

  // 1. Try canonical productMedia (image type, sortOrder 0)
  if (product.productMedia && Array.isArray(product.productMedia) && product.productMedia.length > 0) {
    const images = product.productMedia
      .filter((m: any) => m.mediaType === "image" || m.mediaType === "general")
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    if (images.length > 0 && images[0].url) {
      return {
        url: images[0].url.trim(),
        mediaType: images[0].mediaType || "image",
        assetRole: images[0].assetRole || "general"
      };
    }
  }

  // 2. Try legacy imageUrl field
  if (product.imageUrl) {
    try {
      const urlStr = product.imageUrl.trim();
      if (urlStr.startsWith('[') && urlStr.endsWith(']')) {
        const parsed = JSON.parse(urlStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return { url: parsed[0], mediaType: "image", assetRole: "general" };
        }
      } else {
        return { url: urlStr, mediaType: "image", assetRole: "general" };
      }
    } catch {
      return { url: product.imageUrl, mediaType: "image", assetRole: "general" };
    }
  }

  // 3. Ultimate fallback
  return { url: DEFAULT_FALLBACK_IMAGE, mediaType: "image", assetRole: "general" };
}

/**
 * Resolves all assets of a specific role/type from a product.
 * Used for galleries, spec downloads, CAD models, etc.
 */
 */
export function resolveProductAssets(product: any, filter?: { mediaType?: string; assetRole?: string }): ResolvedProductAsset[] {
  if (!product) return [];

  // 1. If we have canonical media, use it exclusively for galleries.
  if (product.productMedia && Array.isArray(product.productMedia) && product.productMedia.length > 0) {
    let filtered = product.productMedia;
    
    if (filter?.mediaType) {
      filtered = filtered.filter((m: any) => m.mediaType === filter.mediaType);
    }
    if (filter?.assetRole) {
      filtered = filtered.filter((m: any) => m.assetRole === filter.assetRole);
    }

    if (filtered.length > 0) {
      return filtered
        .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map((m: any) => ({
          url: m.url.trim(),
          mediaType: m.mediaType,
          assetRole: m.assetRole
        }));
    }
  }

  // 2. Fallback to legacy field if requesting general images and no canonical media exists
  if (!filter || filter.mediaType === "image" || filter.assetRole === "general") {
    if (product.imageUrl) {
      try {
        const urlStr = product.imageUrl.trim();
        if (urlStr.startsWith('[') && urlStr.endsWith(']')) {
          const parsed = JSON.parse(urlStr);
          if (Array.isArray(parsed)) {
            return parsed.map((url: string) => ({ url, mediaType: "image", assetRole: "general" }));
          }
        }
        return [{ url: urlStr, mediaType: "image", assetRole: "general" }];
      } catch {
        return [{ url: product.imageUrl, mediaType: "image", assetRole: "general" }];
      }
    }
  }

  // 3. Fallback to legacy cadImages field
  if (filter?.mediaType === "cad" || filter?.assetRole === "drawing") {
    if (product.cadImages) {
      try {
        if (Array.isArray(product.cadImages)) {
          return product.cadImages.map((url: string) => ({ url, mediaType: "cad", assetRole: "drawing" }));
        }
        if (typeof product.cadImages === 'string') {
          const parsed = JSON.parse(product.cadImages);
          if (Array.isArray(parsed)) {
            return parsed.map((url: string) => ({ url, mediaType: "cad", assetRole: "drawing" }));
          }
          return [{ url: product.cadImages, mediaType: "cad", assetRole: "drawing" }];
        }
      } catch {
        return [{ url: product.cadImages as string, mediaType: "cad", assetRole: "drawing" }];
      }
    }
  }

  return [];
}
