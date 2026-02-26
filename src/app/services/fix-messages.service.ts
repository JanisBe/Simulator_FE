import { Injectable, inject } from '@angular/core';
import { MessagesStore } from '../store/messages.store';
import { ConnectionDetailsStore } from '../store/connection-details.store';
import { FixMessageConverterService } from './fix-message-converter.service';
import { FixMessageType, Property } from '../models/fix-models';

@Injectable({
  providedIn: 'root'
})
export class FixMessagesService {

  readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  private fixMessageConverterService = inject(FixMessageConverterService);
  selectedMessageType = '';

  getMessageForEdit(messageType: FixMessageType) {
      switch (messageType) {
        case 'OINP':
          return this.messagesStore.editedMessage();
        case 'TBKD':
          return this.messagesStore.editedTBKDMessage();
        case 'ECNI':
          return this.messagesStore.editedECNIMessage();
        case 'MERR':
          return this.messagesStore.editedErrorMessage();
        default:
          return this.messagesStore.editedMessage();
      }
    }
  
    addMessage(propereties: Property[], messageType: FixMessageType = 'OINP') {
      const payload =
        this.fixMessageConverterService.convertParamsListToSerializedPayload(propereties);
      switch (messageType) {
        case 'OINP': {
          this.messagesStore.addMessage({
            type: this.selectedMessageType,
            payload: payload,
            id: Date.now(),
          });
          break;
        }
        case 'TBKD': {
          this.messagesStore.updateSelectedTBKDTemplate({ name: 'custom', payload: payload });
          this.messagesStore.updateEditedTBKDMessage({ id: 0, type: 'TBKD', payload: payload });
          break;
        }
        case 'ECNI': {
          this.messagesStore.updateSelectedECNITemplate({ name: 'custom', payload: payload });
          this.messagesStore.updateEditedECNIMessage({ id: 0, type: 'ECNI', payload: payload });
          break;
        }
        case 'MERR': {
          this.messagesStore.updateSelectedMERRTemplate({ name: 'custom', payload: payload });
          this.messagesStore.updateEditedErrorMessage({ id: 0, type: 'MERR', payload: payload });
        }
      }
    }
  
    modifyMessage(propereties: Property[], messageType: FixMessageType) {
      const payload =
        this.fixMessageConverterService.convertParamsListToSerializedPayload(propereties);
  
      switch (messageType) {
        case 'OINP': {
          this.messagesStore.updateMessage({
            type: this.selectedMessageType,
            payload: payload,
            id: this.messagesStore.editedMessage().id,
          });
          break;
        }
        case 'TBKD': {
          this.messagesStore.updateEditedTBKDMessage({ id: 0, type: 'TBKD', payload: payload });
          break;
        }
        case 'ECNI': {
          this.messagesStore.updateEditedECNIMessage({ id: 0, type: 'ECNI', payload: payload });
          break;
        }
        case 'MERR': {
          this.messagesStore.updateEditedErrorMessage({ id: 0, type: 'MERR', payload: payload });
          break;
        }
      }
    }

    clearInputs() {
      this.selectedMessageType = '';
    }

}
