import { CommandResult, CommandContext } from '../../../contracts/base';
import { ProcessBomInput, ProcessBomResult, ProcessBomCommand } from './BomContract';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockProcessBomAdapter implements ProcessBomCommand {
  async execute(input: ProcessBomInput, context: CommandContext): Promise<CommandResult<ProcessBomResult>> {
    await delay(1500); // Simulate extraction and matching
    
    return {
      status: 'SUCCESS',
      data: {
        matches: [
          {
            extractedComponent: 'T-Motor MN4014',
            canonicalMatch: 'RUD-MOT-MN4014',
            matchId: 'RUD-MOT-MN4014',
            status: 'Matched'
          },
          {
            extractedComponent: 'Hobbywing X8',
            canonicalMatch: 'RUD-ESC-X8',
            matchId: 'RUD-ESC-X8',
            status: 'Matched'
          },
          {
            extractedComponent: 'Pixhawk 6X',
            canonicalMatch: 'RUD-FC-PX6X',
            matchId: 'RUD-FC-PX6X',
            status: 'Matched'
          },
          {
            extractedComponent: 'LiPo 6S 5000mAh',
            canonicalMatch: 'RUD-PWR-6S5K',
            matchId: 'RUD-PWR-6S5K',
            status: 'Matched'
          },
          {
            extractedComponent: 'M10 GNSS',
            status: 'Review'
          }
        ]
      }
    };
  }
}
