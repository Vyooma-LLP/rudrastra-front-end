export function getProductImage(imageUrl: string | null | undefined, fallback = "/images/products/rudrastra_motor_1785921295587.png"): string {
  if (!imageUrl) return fallback;
  try {
    const trimmed = imageUrl.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        if (parsed.length > 0) {
          return parsed[0] || fallback;
        } else {
          return fallback;
        }
      }
    }
    return trimmed || fallback;
  } catch {
    return imageUrl || fallback;
  }
}
