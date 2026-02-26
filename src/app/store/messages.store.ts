import { patchState, signalStore, withMethods, withState, type } from '@ngrx/signals';
import {
  withEntities,
  addEntity,
  updateEntity,
  removeEntity,
  removeEntities,
} from '@ngrx/signals/entities';
import { Message, Template } from '../models/models';

interface MessagesState {
  editedMessage: Message;
  //fix
  selectedTBKDTemplate: Template;
  selectedECNITemplate: Template;
  selectedMERRTemplate: Template;
  editedTBKDMessage: Message;
  editedECNIMessage: Message;
  editedErrorMessage: Message;
  errorFrequency: number;
  batchMessagesCount: number;
  batchMessageStatus: string;
}

const initialState: MessagesState = {
  editedMessage: {
    id: 0,
    payload: '',
    type: '',
  },
  selectedTBKDTemplate: {
    name: '',
    payload: '',
  },
  selectedECNITemplate: {
    name: '',
    payload: '',
  },
  selectedMERRTemplate: {
    name: '',
    payload: '',
  },
  editedTBKDMessage: {
    id: 0,
    payload: '',
    type: '',
  },
  editedECNIMessage: {
    id: 0,
    payload: '',
    type: '',
  },
  editedErrorMessage: {
    id: 0,
    payload: '',
    type: '',
  },
  errorFrequency: 0,
  batchMessagesCount: 0,
  batchMessageStatus: '',
};

export const MessagesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities({ entity: type<Message>(), collection: 'distributorMessages' }),
  withMethods(store => ({
    addMessage(message: Message) {
      patchState(store, addEntity(message, { collection: 'distributorMessages' }));
    },
    updateMessage(message: Message) {
      patchState(
        store,
        updateEntity(
          {
            id: message.id,
            changes: { payload: message.payload, type: message.type },
          },
          { collection: 'distributorMessages' },
        ),
      );
    },
    deleteMessage(messageId: number) {
      patchState(store, removeEntity(messageId, { collection: 'distributorMessages' }));
    },
    deleteAllMessages() {
      patchState(
        store,
        removeEntities(() => true, { collection: 'distributorMessages' }),
      );
    },
    updateEditedMessage(message: Message) {
      patchState(store, () => ({ editedMessage: message }));
    },
    updateSelectedTBKDTemplate(template: Template) {
      patchState(store, () => ({ selectedTBKDTemplate: template }));
    },
    updateSelectedErrorFrequency(intervalValue: number) {
      patchState(store, () => ({ errorFrequency: intervalValue }));
    },
    updateSelectedECNITemplate(template: Template) {
      patchState(store, () => ({ selectedECNITemplate: template }));
    },
    updateSelectedMERRTemplate(template: Template) {
      patchState(store, () => ({ selectedMERRTemplate: template }));
    },
    updateEditedTBKDMessage(message: Message) {
      patchState(store, () => ({ editedTBKDMessage: message }));
    },
    updateEditedECNIMessage(message: Message) {
      patchState(store, () => ({ editedECNIMessage: message }));
    },
    updateEditedErrorMessage(message: Message) {
      patchState(store, () => ({ editedErrorMessage: message }));
    },
    updateBatchMessagesCount(count: number) {
      patchState(store, () => ({ batchMessagesCount: count }));
    },
    updateBatchMessagesState(status: string) {
      patchState(store, () => ({ batchMessageStatus: status }));
    },
  })),
);
