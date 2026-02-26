import { EnviromentAvaliableDistributors } from '../models/fix-models';

export interface Message {
  id: number;
  type: string;
  payload: string;
  transactionId?: string;
}

export interface ReceivedMessage {
  payload: string;
}

export interface MessageEditorModalPayload {
  modalMode: MessageEditorModalMode;
}

export type MessageEditorModalMode = 'new' | 'edit' | 'reply';

export interface Template {
  name: string;
  payload: string;
}

export interface Hint {
  fieldName: string;
  hint: string;
}

export interface AppConfig {
  distributors: EnviromentAvaliableDistributors[];
  providers: string[];
  tbkdTemplates: Template[];
  ecniTemplates: Template[];
  merrTemplates: Template[];
  oinpTemplates: Template[];
  environments: string[];
  hints: Hint[];
  stompWebSocketBaseurl: string;
}

export enum ConnectionState {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR,
}

export interface StartStopConnectionMessage {
  connectionState: 'STARTED' | 'ERROR' | 'STOPPED';
}
