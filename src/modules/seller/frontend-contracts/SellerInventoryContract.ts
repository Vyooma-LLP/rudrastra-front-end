import { Query, PageRequest, PageResponse } from '../../../contracts/base';

export interface SellerInventoryItem {
  skuCode: string;
  warehouseLocation: string;
  onHandStock: number;
  reservedStock: number;
  sellableStock: number;
}

export interface ListSellerInventoryInput {
  page: PageRequest;
}

export type ListSellerInventoryQuery = Query<ListSellerInventoryInput, PageResponse<SellerInventoryItem>>;
