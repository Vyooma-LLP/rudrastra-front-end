import { Command } from '../../../contracts/base';

export interface ProcessBomInput {
  fileId: string; // Fake file ID for now
}

export interface BomMatchResult {
  extractedComponent: string;
  canonicalMatch?: string;
  matchId?: string;
  status: 'Matched' | 'Review';
}

export interface ProcessBomResult {
  matches: BomMatchResult[];
}

export type ProcessBomCommand = Command<ProcessBomInput, ProcessBomResult>;
