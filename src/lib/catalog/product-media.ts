/**
 * Canonical product media resolver.
 * Enforces the architectural rule that `productMedia` is the single source of truth for assets,
 * with legacy `imageUrl` preserved only as an ultimate fallback for un-migrated products.
 */

const DEFAULT_FALLBACK_IMAGE = "/images/products/rudrastra_motor_1785921295587.png";

/**
 * Resolves the primary image for a product.
 * Usage: Homepage, Catalog cards, Search, Compare, Cart, Ops preview.
 */
export function resolvePrimaryImage(product: any): string {
  if (!product) return DEFAULT_FALLBACK_IMAGE;

  // 1. Try canonical productMedia (image type, sortOrder 0)
  if (product.productMedia && Array.isArray(product.productMedia) && product.productMedia.length > 0) {
    const images = product.productMedia
      .filter((m: any) => m.mediaType === "image" || m.mediaType === "general")
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    if (images.length > 0 && images[0].url) {
      return images[0].url.trim();
    }
  }

  // 2. Try legacy imageUrl field
  if (product.imageUrl) {
    try {
      const urlStr = product.imageUrl.trim();
      if (urlStr.startsWith('[') && urlStr.endsWith(']')) {
        const parsed = JSON.parse(urlStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } else {
        return urlStr;
      }
    } catch {
      return product.imageUrl;
    }
  }

  // 3. Ultimate fallback
  return DEFAULT_FALLBACK_IMAGE;
}

/**
 * Resolves all assets of a specific role/type from a product.
 * Used for galleries, spec downloads, CAD models, etc.
 */
export function resolveProductAssets(product: any, filter?: { mediaType?: string; assetRole?: string }): string[] {
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

    return filtered
      .sort((a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0))
      .map((m: any) => m.url.trim());
  }

  // 2. Fallback to legacy field if requesting general images and no canonical media exists
  if ((!filter || filter.mediaType === "image") && product.imageUrl) {
    try {
      const urlStr = product.imageUrl.trim();
      if (urlStr.startsWith('[') && urlStr.endsWith(']')) {
        const parsed = JSON.parse(urlStr);
        if (Array.isArray(parsed)) return parsed;
      }
      return [urlStr];
    } catch {
      return [product.imageUrl];
    }
  }

  return [];
}
