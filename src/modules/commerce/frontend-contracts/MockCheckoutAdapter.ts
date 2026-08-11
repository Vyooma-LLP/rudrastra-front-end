import { CommandResult, CommandContext } from '../../../contracts/base';
import { PlaceOrderCommand, PlaceOrderInput, PlaceOrderResult } from './CheckoutContract';

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

export class MockPlaceOrderAdapter implements PlaceOrderCommand {
  async execute(input: PlaceOrderInput, context: CommandContext): Promise<CommandResult<PlaceOrderResult>> {
    await delay(600, context.signal);

    // Simulate order placement
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      status: 'SUCCESS',
      data: {
        orderId,
        status: 'COMPLETED' // Simplified for mock
      }
    };
  }
}
