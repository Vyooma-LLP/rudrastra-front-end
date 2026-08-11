import { CommandResult, CommandContext } from '../../../contracts/base';
import { ComponentSelection, CheckCompatibilityResult, CheckCompatibilityCommand } from './CompatibilityContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockCheckCompatibilityAdapter implements CheckCompatibilityCommand {
  async execute(input: ComponentSelection, context: CommandContext): Promise<CommandResult<CheckCompatibilityResult>> {
    await delay(800); // Simulate processing time

    return {
      status: 'SUCCESS',
      data: {
        isValid: true,
        checks: [
          {
            id: 'chk-1',
            type: 'success',
            title: 'Motor ↔ ESC',
            description: '400KV motor max current (30A) is within 40A ESC continuous rating.'
          },
          {
            id: 'chk-2',
            type: 'success',
            title: 'ESC ↔ Battery',
            description: '6S battery (22.2V nominal) is within ESC 3-6S input limits.'
          },
          {
            id: 'chk-3',
            type: 'success',
            title: 'FC ↔ ESC Protocol',
            description: 'Pixhawk 6X supports PWM/DShot required by XRotor ESC.'
          },
          {
            id: 'chk-4',
            type: 'warning',
            title: 'Propeller Oversize Warning',
            description: '16x5.4 carbon prop on 6S will pull 42A at 100% throttle, exceeding 40A ESC continuous rating. Risk of thermal shutdown.'
          }
        ]
      }
    };
  }
}
