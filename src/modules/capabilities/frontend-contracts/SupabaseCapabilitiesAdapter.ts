import { CommandResult, CommandContext } from '../../../contracts/base';
import { CapabilitiesMap, GetCapabilitiesQuery, ToggleCapabilityCommand, ToggleCapabilityInput } from './CapabilitiesContract';

export class SupabaseGetCapabilitiesAdapter implements GetCapabilitiesQuery {
  async execute(): Promise<CapabilitiesMap> {
    const res = await fetch('/api/capabilities');
    if (!res.ok) throw new Error('Failed to fetch capabilities');
    return res.json();
  }
}

export class SupabaseToggleCapabilityAdapter implements ToggleCapabilityCommand {
  async execute(input: ToggleCapabilityInput, context: CommandContext): Promise<CommandResult<CapabilitiesMap>> {
    const res = await fetch('/api/capabilities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (!res.ok) {
      return { status: 'ERROR', error: { code: 'INTERNAL_ERROR', message: 'Failed to toggle capability' } };
    }
    const data = await res.json();
    return { status: 'SUCCESS', data };
  }
}
