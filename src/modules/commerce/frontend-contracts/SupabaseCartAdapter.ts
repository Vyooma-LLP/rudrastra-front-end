import { CommandResult, CommandContext, QueryContext } from '../../../contracts/base';
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

// We now use the server-calculated summary instead of local calculation.
const toMinor = (major: number): string => Math.round(major * 100).toString();

const mapSummary = (serverSummary: any, itemCount: number) => ({
  subtotal: { amountMinor: toMinor(serverSummary.subtotal), currency: 'INR' },
  gstAmount: { amountMinor: toMinor(serverSummary.tax), currency: 'INR' },
  total: { amountMinor: toMinor(serverSummary.total), currency: 'INR' },
  itemCount
});

const mapCartItem = (data: any): CartItem => ({
  id: data.id,
  mpn: data.mpn,
  name: data.title,
  sellerId: data.sellerId,
  sellerName: data.sellerName,
  offerId: data.offerId,
  unitPrice: { amountMinor: toMinor(parseFloat(data.price)), currency: 'INR' },
  quantity: data.quantity,
  stockAvailable: data.stockQty,
  leadTimeDays: 3 // mock for now since it's not in db
});

export class SupabaseGetCartAdapter implements GetCartQuery {
  async execute(input: void, context?: QueryContext): Promise<CartState> {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          return {
            items: [],
            summary: mapSummary({ subtotal: 0, tax: 0, total: 0 }, 0),
            isCompatibilityPassed: true
          };
        }
        throw new Error(`Failed to fetch cart: ${res.statusText}`);
      }
      const { items, summary } = await res.json();
      const mappedItems = items.map(mapCartItem);
      const itemCount = mappedItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      return {
        items: mappedItems,
        summary: summary ? mapSummary(summary, itemCount) : mapSummary({ subtotal: 0, tax: 0, total: 0 }, 0),
        isCompatibilityPassed: true
      };
    } catch (e: any) {
      console.warn('Cart fetch failed, falling back to empty cart:', e);
      return {
        items: [],
        summary: mapSummary({ subtotal: 0, tax: 0, total: 0 }, 0),
        isCompatibilityPassed: true
      };
    }
  }
}

export class SupabaseAddToCartAdapter implements AddToCartCommand {
  async execute(input: AddToCartInput, context: CommandContext): Promise<CommandResult<CartState>> {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ADD', payload: { mpn: input.mpn, sellerId: input.sellerId, productId: input.productId, variantId: input.variantId, offerId: input.offerId, quantity: input.quantity } })
      });
      // NOTE: Our backend expects productId. For this MVP, if the frontend sends mpn as productId it might fail if they are UUIDs. 
      // If the cart add sends a product UUID, it works.
      const { items, summary, error } = await res.json();
      if (error) return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: error } };
      
      const mappedItems = items.map(mapCartItem);
      const itemCount = mappedItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      return { status: 'SUCCESS', data: { items: mappedItems, summary: mapSummary(summary, itemCount), isCompatibilityPassed: true } };
    } catch (e: any) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: e.message } };
    }
  }
}

export class SupabaseRemoveFromCartAdapter implements RemoveFromCartCommand {
  async execute(input: RemoveFromCartInput, context: CommandContext): Promise<CommandResult<CartState>> {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REMOVE', payload: { itemId: input.itemId } })
      });
      const { items, summary, error } = await res.json();
      if (error) return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: error } };
      
      const mappedItems = items.map(mapCartItem);
      const itemCount = mappedItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      return { status: 'SUCCESS', data: { items: mappedItems, summary: mapSummary(summary, itemCount), isCompatibilityPassed: true } };
    } catch (e: any) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: e.message } };
    }
  }
}

export class SupabaseUpdateCartItemAdapter implements UpdateCartItemCommand {
  async execute(input: UpdateCartItemInput, context: CommandContext): Promise<CommandResult<CartState>> {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPDATE', payload: { itemId: input.itemId, quantity: input.quantity } })
      });
      const { items, summary, error } = await res.json();
      if (error) return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: error } };
      
      const mappedItems = items.map(mapCartItem);
      const itemCount = mappedItems.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
      return { status: 'SUCCESS', data: { items: mappedItems, summary: mapSummary(summary, itemCount), isCompatibilityPassed: true } };
    } catch (e: any) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: e.message } };
    }
  }
}

export class SupabaseSetProjectContextAdapter implements SetProjectContextCommand {
  async execute(input: SetProjectContextInput, context: CommandContext): Promise<CommandResult<CartState>> {
    // Project context can be managed locally or in another DB table.
    // For MVP, we fetch cart again and just append it locally.
    const getCart = new SupabaseGetCartAdapter();
    const cart = await getCart.execute();
    return { status: 'SUCCESS', data: { ...cart, projectContext: input.projectId } };
  }
}
