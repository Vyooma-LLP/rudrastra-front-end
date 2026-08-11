import { ListSellerInventoryQuery, ListSellerInventoryInput, SellerInventoryItem } from './SellerInventoryContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockInventory: SellerInventoryItem[] = [
  {
    skuCode: 'SKU-ROBU-MN4014-400',
    warehouseLocation: 'Bengaluru Central Hub',
    onHandStock: 42,
    reservedStock: 4,
    sellableStock: 38
  }
];

import { QueryContext, PageResponse } from '../../../contracts/base';

export class MockListSellerInventoryAdapter implements ListSellerInventoryQuery {
  async execute(input: ListSellerInventoryInput, context?: QueryContext): Promise<PageResponse<SellerInventoryItem>> {
    await delay(300);
    return {
      items: mockInventory,
      hasMore: false
    };
  }
}
