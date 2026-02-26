import { MessageEditorModalPayload } from './models';

export interface FixFieldKey {
  id: number;
  description: string;
}

export interface FixQINPMessagesBatchRequest {
  environment: string;
  senderCompId: string;
  targetCompId: string;
  messages: string[];
  frequency: number;
  messageCount: number;
}

export interface FixMessageEditorModalPayload extends MessageEditorModalPayload {
  messageType: FixMessageType;
}

export interface FixMessageError {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  description: string;
  code: number;
}

export type FixMessageType = 'OINP' | 'TBKD' | 'ECNI' | 'MERR';

export interface EnviromentAvaliableDistributors {
  environmentName: string;
  avaliableDistributors: string[];
}

export interface Property {
  propertyKey: number;
  rowId: number;
  propertyValue: string;
  description?: string;
  messages?: string[];
  isTemplateKeyValid: boolean;
}
