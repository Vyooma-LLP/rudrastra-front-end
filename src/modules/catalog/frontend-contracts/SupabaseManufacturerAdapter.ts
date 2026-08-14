import { GetManufacturerProductsQuery, GetManufacturerProductsInput, ManufacturerProduct } from './ManufacturerContract';

import { getProductImage } from '../../../utils/image';

export class SupabaseGetManufacturerProductsAdapter implements GetManufacturerProductsQuery {
  async execute(input: GetManufacturerProductsInput): Promise<ManufacturerProduct[]> {
    // For MVP, since we don't have a manufacturers table with relationships,
    // we just fetch all products and optionally filter if we had the field.
    // Right now, products just have a title/description. 
    // This will fetch from the real backend to replace the mock.
    const res = await fetch('/api/products');
    if (!res.ok) return [];
    
    const { products } = await res.json();
    return products.map((p: any) => ({
      id: p.id,
      name: p.title,
      mpn: p.mpn || p.title,
      category: p.category,
      price: (p.price / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }),
      img: getProductImage(p.imageUrl, '/images/products/rudrastra_motor_1785921295587.png')
    }));
  }
}
