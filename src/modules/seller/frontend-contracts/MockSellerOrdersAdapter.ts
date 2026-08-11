import { CommandResult, CommandContext } from '../../../contracts/base';
import { 
  ListSellerOrdersQuery, 
  ListSellerOrdersInput, 
  SellerOrder, 
  GenerateAwbCommand, 
  GenerateAwbInput, 
  GenerateAwbResult 
} from './SellerOrdersContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockSellerOrders: SellerOrder[] = [
  {
    id: 'RUD-88941-A',
    customerName: 'Vyooma Technologies',
    shippingLocation: 'Hyderabad',
    status: 'AWAITING DISPATCH',
    itemsSummary: '4× T-Motor MN4014 400KV'
  }
];

export class MockListSellerOrdersAdapter implements ListSellerOrdersQuery {
  async execute(input: ListSellerOrdersInput): Promise<SellerOrder[]> {
    await delay(300);
    return [...mockSellerOrders];
  }
}

export class MockGenerateAwbAdapter implements GenerateAwbCommand {
  async execute(input: GenerateAwbInput, context: CommandContext): Promise<CommandResult<GenerateAwbResult>> {
    await delay(1000);
    
    mockSellerOrders = mockSellerOrders.map(order => {
      if (order.id === input.sellerOrderId) {
        return {
          ...order,
          status: 'SHIPPED',
          awb: `SF${Math.floor(10000000 + Math.random() * 90000000)}IN`
        };
      }
      return order;
    });

    const updatedOrder = mockSellerOrders.find(o => o.id === input.sellerOrderId);

    return {
      status: 'SUCCESS',
      data: {
        sellerOrderId: input.sellerOrderId,
        status: 'SHIPPED',
        awb: updatedOrder?.awb || 'UNKNOWN'
      }
    };
  }
}
