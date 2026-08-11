import { CommandResult, CommandContext } from '../../../contracts/base';
import { CapabilitiesMap, GetCapabilitiesQuery, ToggleCapabilityCommand, ToggleCapabilityInput } from './CapabilitiesContract';

// Initial state, we can prepopulate it based on CAPABILITIES from the registry if needed.
// For now, it will start empty, and components will treat missing keys as 'ACTIVE'.
let mockCapabilitiesState: CapabilitiesMap = {};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockGetCapabilitiesAdapter implements GetCapabilitiesQuery {
  async execute(input: void): Promise<CapabilitiesMap> {
    await delay(100);
    return { ...mockCapabilitiesState };
  }
}

export class MockToggleCapabilityAdapter implements ToggleCapabilityCommand {
  async execute(input: ToggleCapabilityInput, context: CommandContext): Promise<CommandResult<CapabilitiesMap>> {
    await delay(300); // Simulate network latency

    const currentState = mockCapabilitiesState[input.featureKey] || 'ACTIVE';
    const newState = currentState === 'ACTIVE' ? 'EMERGENCY_KILLED' : 'ACTIVE';
    
    mockCapabilitiesState = {
      ...mockCapabilitiesState,
      [input.featureKey]: newState
    };

    return { status: 'SUCCESS', data: { ...mockCapabilitiesState } };
  }
}
