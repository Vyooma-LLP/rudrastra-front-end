import { Query, Money } from '../../../contracts/base';

export interface FulfillmentTracker {
  status: 'CREATED' | 'PAYMENT_CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  timestamp: string;
}

export interface SubOrder {
  id: string;
  sellerId: string;
  sellerName: string;
  itemsDescription: string;
  awb?: string;
}

export interface Order {
  id: string;
  status: 'CREATED' | 'PAYMENT_CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  placedOn: string;
  projectContext?: string;
  totalAmount: Money;
  gstAmount: Money;
  transactionId?: string;
  subOrders: SubOrder[];
  fsm: FulfillmentTracker[];
}

export type ListOrdersInput = Record<string, never>;

export interface GetOrderDetailsInput {
  orderId: string;
}

export type ListOrdersQuery = Query<ListOrdersInput, Order[]>;
export type GetOrderDetailsQuery = Query<GetOrderDetailsInput, Order>;
