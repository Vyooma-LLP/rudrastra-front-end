import { GetManufacturerProductsQuery, GetManufacturerProductsInput, ManufacturerProduct } from './ManufacturerContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockManufacturerProducts: Record<string, ManufacturerProduct[]> = {
  't-motor': [
    { id: 'RUD-MOT-MN4014', name: 'Navigator Series MN4014', mpn: 'MN4014', category: 'Propulsion', price: '₹12,450', img: '/images/products/rudrastra_motor_1785921295587.png' },
    { id: 'RUD-MOT-MN3510', name: 'Navigator Series MN3510', mpn: 'MN3510', category: 'Propulsion', price: '₹8,900', img: '/images/products/rudrastra_motor_1785921295587.png' },
    { id: 'RUD-MOT-MN4010', name: 'Navigator Series MN4010', mpn: 'MN4010', category: 'Propulsion', price: '₹10,200', img: '/images/products/rudrastra_motor_1785921295587.png' }
  ],
  'cubepilot': [
    { id: 'RUD-FC-CUBE-ORANGE', name: 'Cube Orange+ Flight Controller', mpn: 'Cube Orange+', category: 'Avionics', price: '₹34,500', img: '/images/products/rudrastra_fc_1785921305227.png' }
  ],
  'holybro': [
    { id: 'RUD-GPS-HOLY-M8N', name: 'Micro M8N GPS Module', mpn: 'Holybro M8N', category: 'Navigation', price: '₹4,800', img: '/images/products/rudrastra_gps_1785921355597.png' }
  ]
};

export class MockGetManufacturerProductsAdapter implements GetManufacturerProductsQuery {
  async execute(input: GetManufacturerProductsInput): Promise<ManufacturerProduct[]> {
    await delay(300);
    const key = input.manufacturerSlug.toLowerCase();
    return mockManufacturerProducts[key] || [];
  }
}
