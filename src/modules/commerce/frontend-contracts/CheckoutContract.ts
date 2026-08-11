import { Command } from '../../../contracts/base';

export interface CheckoutState {
  shippingAddress: string;
  companyName: string;
  gstin: string;
  paymentMethod: 'NET_TERMS' | 'RAZORPAY';
}

export interface PlaceOrderInput {
  cartId?: string;
  shippingAddress: string;
  companyName: string;
  gstin: string;
  paymentMethod: 'NET_TERMS' | 'RAZORPAY';
}

export interface PlaceOrderResult {
  orderId: string;
  status: 'PROCESSING' | 'COMPLETED' | 'PAYMENT_REQUIRED';
}

export type PlaceOrderCommand = Command<PlaceOrderInput, PlaceOrderResult>;
