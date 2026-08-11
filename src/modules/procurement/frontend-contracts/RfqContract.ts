import { Command } from '../../../contracts/base';

export interface RfqAttachment {
  fileId: string;
  fileName: string;
  mimeType: 'text/csv' | 'application/vnd.ms-excel' | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  scanStatus: 'PENDING' | 'CLEAN' | 'INFECTED';
}

export interface SubmitRfqInput {
  company: string;
  name: string;
  email: string;
  phone: string;
  requirements: string;
  deliveryLocation: string;
  requiredBy: string;
  attachments?: RfqAttachment[]; // Semantic upload attachments instead of blind form data
}

export interface SubmitRfqResult {
  rfqId: string;
  status: 'RECEIVED';
}

export type SubmitRfqCommand = Command<SubmitRfqInput, SubmitRfqResult>;
