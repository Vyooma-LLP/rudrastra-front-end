import { CommandResult, CommandContext } from '../../../contracts/base';
import { SubmitRfqCommand, SubmitRfqInput, SubmitRfqResult } from './RfqContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockSubmitRfqAdapter implements SubmitRfqCommand {
  async execute(input: SubmitRfqInput, context: CommandContext): Promise<CommandResult<SubmitRfqResult>> {
    await delay(1000);

    const rfqId = `RFQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    return {
      status: 'SUCCESS',
      data: {
        rfqId,
        status: 'RECEIVED'
      }
    };
  }
}
