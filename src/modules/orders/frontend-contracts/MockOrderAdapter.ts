import { Order, ListOrdersQuery, ListOrdersInput, GetOrderDetailsQuery, GetOrderDetailsInput } from './OrderContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockOrders: Order[] = [
  {
    id: 'RUD-2026-88941',
    status: 'PAYMENT_CONFIRMED',
    placedOn: 'Aug 9, 2026',
    projectContext: 'Autonomous FOD Drone V2',
    totalAmount: { amountMinor: '5817400', currency: 'INR' },
    gstAmount: { amountMinor: '887400', currency: 'INR' },
    transactionId: 'pay_Pz92Kx001A',
    subOrders: [
      {
        id: 'RUD-88941-A',
        sellerId: 'seller-robouav',
        sellerName: 'Robouav India',
        itemsDescription: '4× T-Motor Navigator MN4014 400KV Motor',
        awb: 'SF88291029IN'
      },
      {
        id: 'RUD-88941-B',
        sellerId: 'seller-vyooma',
        sellerName: 'Vyooma Systems',
        itemsDescription: '1× Cube Pilot Cube Orange+ Flight Controller',
        awb: 'SF88291030IN'
      }
    ],
    fsm: [
      { status: 'CREATED', timestamp: 'Aug 9, 10:30 AM' },
      { status: 'PAYMENT_CONFIRMED', timestamp: 'Aug 9, 10:32 AM' }
    ]
  }
];

export class MockListOrdersAdapter implements ListOrdersQuery {
  async execute(input: ListOrdersInput): Promise<Order[]> {
    await delay(300);
    return mockOrders;
  }
}

export class MockGetOrderDetailsAdapter implements GetOrderDetailsQuery {
  async execute(input: GetOrderDetailsInput): Promise<Order> {
    await delay(300);
    const order = mockOrders.find(o => o.id === input.orderId);
    if (!order) {
      throw new Error(`Order ${input.orderId} not found`);
    }
    return order;
  }
}
