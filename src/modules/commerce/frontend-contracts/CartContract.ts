import { Command, Query, Money } from '../../../contracts/base';

export interface CartItem {
  id: string;
  mpn: string;
  name: string;
  sellerId: string;
  sellerName: string;
  unitPrice: Money;
  quantity: number;
  stockAvailable: number;
  leadTimeDays: number;
}

export interface CartSummary {
  subtotal: Money;
  gstAmount: Money;
  total: Money;
  itemCount: number;
}

export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  projectContext?: string;
  isCompatibilityPassed: boolean;
}

export interface AddToCartInput {
  mpn: string;
  sellerId: string;
  quantity: number;
}

export interface RemoveFromCartInput {
  itemId: string;
}

export interface UpdateCartItemInput {
  itemId: string;
  quantity: number;
}

export interface SetProjectContextInput {
  projectId: string;
}

export type GetCartQuery = Query<void, CartState>;
export type AddToCartCommand = Command<AddToCartInput, CartState>;
export type RemoveFromCartCommand = Command<RemoveFromCartInput, CartState>;
export type UpdateCartItemCommand = Command<UpdateCartItemInput, CartState>;
export type SetProjectContextCommand = Command<SetProjectContextInput, CartState>;
