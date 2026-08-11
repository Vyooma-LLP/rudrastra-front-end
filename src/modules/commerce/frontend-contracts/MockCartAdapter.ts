import { CommandResult, CommandContext, QueryContext, Money } from '../../../contracts/base';
import { 
  CartState, 
  GetCartQuery, 
  AddToCartCommand, 
  AddToCartInput,
  RemoveFromCartCommand,
  RemoveFromCartInput,
  UpdateCartItemCommand,
  UpdateCartItemInput,
  SetProjectContextCommand,
  SetProjectContextInput,
  CartItem
} from './CartContract';

const delay = (ms: number, signal?: AbortSignal) => new Promise((resolve, reject) => {
  if (signal?.aborted) return reject(new Error('Aborted'));
  const timer = setTimeout(resolve, ms);
  if (signal) {
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Aborted'));
    });
  }
});

const toMinor = (major: number): string => Math.round(major * 100).toString();

// Internal in-memory state
let mockCartState: CartState = {
  items: [
    {
      id: 'item-1',
      mpn: 'MN4014-400KV',
      name: 'T-Motor Navigator MN4014 400KV',
      sellerId: 'seller-robouav',
      sellerName: 'Robouav India',
      unitPrice: { amountMinor: toMinor(8499.00), currency: 'INR' },
      quantity: 4,
      stockAvailable: 38,
      leadTimeDays: 2
    },
    {
      id: 'item-2',
      mpn: 'CUBE-ORANGE-PLUS',
      name: 'CubePilot Cube Orange+ Standard Set',
      sellerId: 'seller-vyooma',
      sellerName: 'Vyooma Systems',
      unitPrice: { amountMinor: toMinor(18500.00), currency: 'INR' },
      quantity: 1,
      stockAvailable: 12,
      leadTimeDays: 1
    }
  ],
  summary: {
    subtotal: { amountMinor: toMinor(52496.00), currency: 'INR' },
    gstAmount: { amountMinor: toMinor(9449.28), currency: 'INR' },
    total: { amountMinor: toMinor(61945.28), currency: 'INR' },
    itemCount: 5
  },
  projectContext: 'PRJ-882',
  isCompatibilityPassed: true
};

const calculateSummary = (items: CartItem[]) => {
  const subtotalMajor = items.reduce((acc, item) => acc + ((parseInt(item.unitPrice.amountMinor, 10)/100) * item.quantity), 0);
  const gstAmountMajor = subtotalMajor * 0.18; // Flat 18% for mock
  const totalMajor = subtotalMajor + gstAmountMajor;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return {
    subtotal: { amountMinor: toMinor(subtotalMajor), currency: 'INR' },
    gstAmount: { amountMinor: toMinor(gstAmountMajor), currency: 'INR' },
    total: { amountMinor: toMinor(totalMajor), currency: 'INR' },
    itemCount
  };
};

export class MockGetCartAdapter implements GetCartQuery {
  async execute(input: void, context?: QueryContext): Promise<CartState> {
    await delay(200, context?.signal);
    return { ...mockCartState };
  }
}

export class MockAddToCartAdapter implements AddToCartCommand {
  async execute(input: AddToCartInput, context: CommandContext): Promise<CommandResult<CartState>> {
    await delay(300, context.signal);
    
    // Simplistic mock implementation
    const newItem: CartItem = {
      id: `item-${Date.now()}`,
      mpn: input.mpn,
      name: `Mocked Product ${input.mpn}`,
      sellerId: input.sellerId,
      sellerName: 'Mock Seller',
      unitPrice: { amountMinor: toMinor(5000), currency: 'INR' },
      quantity: input.quantity,
      stockAvailable: 100,
      leadTimeDays: 3
    };

    const newItems = [...mockCartState.items, newItem];
    mockCartState = {
      ...mockCartState,
      items: newItems,
      summary: calculateSummary(newItems)
    };

    return { status: 'SUCCESS', data: { ...mockCartState } };
  }
}

export class MockRemoveFromCartAdapter implements RemoveFromCartCommand {
  async execute(input: RemoveFromCartInput, context: CommandContext): Promise<CommandResult<CartState>> {
    await delay(300, context.signal);
    
    const newItems = mockCartState.items.filter(i => i.id !== input.itemId);
    mockCartState = {
      ...mockCartState,
      items: newItems,
      summary: calculateSummary(newItems)
    };

    return { status: 'SUCCESS', data: { ...mockCartState } };
  }
}

export class MockUpdateCartItemAdapter implements UpdateCartItemCommand {
  async execute(input: UpdateCartItemInput, context: CommandContext): Promise<CommandResult<CartState>> {
    await delay(300, context.signal);
    
    const newItems = mockCartState.items.map(i => 
      i.id === input.itemId ? { ...i, quantity: input.quantity } : i
    );
    mockCartState = {
      ...mockCartState,
      items: newItems,
      summary: calculateSummary(newItems)
    };

    return { status: 'SUCCESS', data: { ...mockCartState } };
  }
}

export class MockSetProjectContextAdapter implements SetProjectContextCommand {
  async execute(input: SetProjectContextInput, context: CommandContext): Promise<CommandResult<CartState>> {
    await delay(300, context.signal);
    
    mockCartState = {
      ...mockCartState,
      projectContext: input.projectId
    };

    return { status: 'SUCCESS', data: { ...mockCartState } };
  }
}
