import { Query, Command } from '../../../contracts/base';

export interface SellerOrder {
  id: string;
  customerName: string;
  shippingLocation: string;
  status: 'AWAITING DISPATCH' | 'SHIPPED' | 'DELIVERED';
  itemsSummary: string;
  awb?: string;
}

export type ListSellerOrdersInput = Record<string, never>;
export interface GenerateAwbInput {
  sellerOrderId: string;
}
export interface GenerateAwbResult {
  sellerOrderId: string;
  awb: string;
  status: 'SHIPPED';
}

export type ListSellerOrdersQuery = Query<ListSellerOrdersInput, SellerOrder[]>;
export type GenerateAwbCommand = Command<GenerateAwbInput, GenerateAwbResult>;
