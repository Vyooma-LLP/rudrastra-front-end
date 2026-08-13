import { Order, ListOrdersQuery, ListOrdersInput, GetOrderDetailsQuery, GetOrderDetailsInput } from './OrderContract';

export class SupabaseListOrdersAdapter implements ListOrdersQuery {
  async execute(input: ListOrdersInput): Promise<Order[]> {
    const res = await fetch('/api/orders');
    if (!res.ok) {
      console.error('Failed to fetch orders');
      return [];
    }
    const { orders } = await res.json();
    return orders.map((o: any) => ({
      id: o.id,
      status: o.status,
      placedOn: new Date(o.createdAt).toLocaleDateString(),
      totalAmount: { amountMinor: o.total.toString(), currency: o.currency },
      gstAmount: { amountMinor: o.tax.toString(), currency: o.currency },
      transactionId: 'N/A', // Not stored in MVP orders table
      subOrders: [], // Not modelled for MVP frontend display
      fsm: []
    }));
  }
}

export class SupabaseGetOrderDetailsAdapter implements GetOrderDetailsQuery {
  async execute(input: GetOrderDetailsInput): Promise<Order> {
    // In MVP, we might just reuse the list or have a separate endpoint
    throw new Error('Not implemented for MVP individual fetch');
  }
}
