import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { FixMessagesService } from './fix-messages.service';
import { FixMessageType, Property } from '../models/fix-models';

describe('FixMessagesService', () => {
  let service: FixMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add proper OINP message', () => {
    service.addMessage([generateProperty(4, 'test'), generateProperty(5, 'test2')], 'OINP');

    const message = service.messagesStore.distributorMessagesEntities()[0];
    expect(message.payload).toEqual('4=test|5=test2|');
  });

  it('should add proper OINP message with default parameter', () => {
    service.addMessage([generateProperty(4, 'test'), generateProperty(5, 'test2')]);

    const message = service.messagesStore.distributorMessagesEntities()[0];
    expect(message.payload).toEqual('4=test|5=test2|');
  });

  it('should add proper ECNI reply message', () => {
    service.addMessage([generateProperty(4, 'test'), generateProperty(5, 'test2')], 'ECNI');

    const message = service.getMessageForEdit('ECNI');
    expect(message.payload).toEqual('4=test|5=test2|');
  });

  it('should add proper TBKD reply message', () => {
    service.addMessage([generateProperty(4, 'test'), generateProperty(5, 'test2')], 'TBKD');

    const message = service.getMessageForEdit('TBKD');
    expect(message.payload).toEqual('4=test|5=test2|');
  });

  it('should add proper MERR reply message', () => {
    service.addMessage([generateProperty(4, 'test'), generateProperty(5, 'test2')], 'MERR');

    service.getMessageForEdit('MERR');
    expect(service).toBeTruthy();
  });

  it('should clear inputs', () => {
    service.clearInputs();

    expect(service.selectedMessageType).toEqual('');
  });

  it('should properly modify TBKD message', () => {
    service.modifyMessage([generateProperty(4, 'test'), generateProperty(5, 'test2')], 'TBKD');

    const message = service.getMessageForEdit('TBKD');
    expect(message.payload).toEqual('4=test|5=test2|');
  });

  it('should properly modify selected OINP message', () => {
    service.addMessage([generateProperty(4, 'test'), generateProperty(5, 'testbefore')], 'OINP');

    let message = service.messagesStore.distributorMessagesEntities()[0];
    service.messagesStore.updateEditedMessage(message);

    service.modifyMessage(
      [generateProperty(4, 'test'), generateProperty(5, 'test2edited')],
      'OINP',
    );

    message = service.messagesStore.distributorMessagesEntities()[0];

    expect(message.payload).toEqual('4=test|5=test2edited|');
  });

  it('should properly modify ECNI message', () => {
    service.modifyMessage(
      [generateProperty(4, 'test'), generateProperty(5, 'test2edited')],
      'ECNI',
    );

    const message = service.messagesStore.editedECNIMessage();
    expect(message.payload).toEqual('4=test|5=test2edited|');
  });

  it('should return oinp default message type in edit message for invalid parameters', () => {
    service.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    service.connectionDetailsStore.updateSelectedProvider('ZIN02');
    service.messagesStore.updateEditedMessage({
      id: 1,
      type: 'OINP',
      payload: '1234',
    });

    const message = service.getMessageForEdit('test' as FixMessageType);
    expect(message.type).toEqual('OINP');
  });
});

function generateProperty(propertyKey = 0, propertyValue = ''): Property {
  return {
    propertyKey: propertyKey,
    propertyValue: propertyValue,
    isTemplateKeyValid: false,
    messages: [],
    rowId: Date.now(),
    description: '',
  };
}
