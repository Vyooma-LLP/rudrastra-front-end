import { CommandResult, CommandContext } from '../../../contracts/base';
import { PlaceOrderCommand, PlaceOrderInput, PlaceOrderResult } from './CheckoutContract';

export class SupabasePlaceOrderAdapter implements PlaceOrderCommand {
  async execute(input: PlaceOrderInput, context: CommandContext): Promise<CommandResult<PlaceOrderResult>> {
    try {
      const idempotencyKey = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2) + Date.now().toString(36);

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          shippingAddress: {
            // Simplified from input for MVP
            // firstName: input.shippingAddress.firstName,
            // lastName: input.shippingAddress.lastName,
            email: "",
            address: ""
          }
        }),
        signal: context.signal
      });

      const json = await res.json();

      if (!res.ok) {
        return {
          status: 'ERROR',
          error: { code: 'INTERNAL_ERROR', message: json.error || 'Failed to place order' }
        };
      }

      return {
        status: 'SUCCESS',
        data: {
          orderId: json.orderId,
          status: json.status
        }
      };
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
      return {
        status: 'ERROR',
        error: { code: 'INTERNAL_ERROR', message: e.message }
      };
    }
  }
}
