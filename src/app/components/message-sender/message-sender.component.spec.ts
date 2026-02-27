import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MessageSenderComponent } from './message-sender.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SimulatorEngineWsConnectionService } from '../../services/simulator-engine-ws-connection.service';
import { SimulatorEngineWsMockedConnectionService } from '../../services/simulator-engine-ws-mocked-connection.service';
import { ConnectionState } from '../../models/models';
import { ToastrModule } from 'ngx-toastr';

describe('MessageSenderComponent', () => {
  let component: MessageSenderComponent;
  let fixture: ComponentFixture<MessageSenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageSenderComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: SimulatorEngineWsConnectionService,
          useClass: SimulatorEngineWsMockedConnectionService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('send message button should be disabled if all required params are selected and there is no selected message', () => {
    component.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    component.connectionDetailsStore.updateSelectedProvider('ZIN02');
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    component.connectionDetailsStore.updateSelectedEnvironment('BETA');

    expect(component.isSendMessagesButtonDisabled()).toBe(true);
  });

  it('send message button should be disabled if not all required params are selected', () => {
    component.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    component.connectionDetailsStore.updateSelectedProvider('ZIN02');

    expect(component.isSendMessagesButtonDisabled()).toBe(true);
  });

  it('send message button should be disabled if not all required params are selected', () => {
    component.connectionDetailsStore.updateSelectedProvider('ZIN02');
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');

    expect(component.isSendMessagesButtonDisabled()).toBe(true);
  });

  it('add new message button should be enabled if all required params are selected', () => {
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    component.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    component.connectionDetailsStore.updateSelectedEnvironment('BETA');
    expect(component.isAddNewMessageButtonDisabled()).toBe(false);
  });

  it('add new message button should be disabled if not all required params are selected', () => {
    expect(component.isAddNewMessageButtonDisabled()).toBe(true);
  });

  it('should delete added message on message click', () => {
    component.messagesStore.addMessage({ id: 1, type: 'OINP', payload: 'test' });
    component.onDeleteMessageClick({ id: 1, type: 'OINP', payload: 'test' });
    expect(component.messagesStore.distributorMessagesEntities().length).toEqual(0);
  });

  it('should open add message modal on add new message click', () => {
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    component.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    component.connectionDetailsStore.updateSelectedEnvironment('BETA');
    component.onAddNewMessageClick();
    fixture.detectChanges();
    expect(component.isAddNewMessageButtonDisabled()).toEqual(false);
  });

  it('should open modify message modal on row message click', () => {
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    component.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    component.connectionDetailsStore.updateSelectedEnvironment('BETA');
    const message = { id: 1, type: 'OINP', payload: 'test' };
    component.messagesStore.addMessage({ id: 1, type: 'OINP', payload: 'test' });
    component.onRowClick(message);
    fixture.detectChanges();
    expect(component.messagesStore.editedMessage().id).toEqual(1);
  });

  it('should disable connect to distributor session when conditions are not satisifed 1', () => {
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    expect(component.isConnectToDistributorSessionDisabled()).toEqual(true);
  });

  it('should disable connect to distributor session when conditions are not satisifed 2', () => {
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    component.connectionDetailsStore.updateSelectedDistributor('Test');
    expect(component.isConnectToDistributorSessionDisabled()).toEqual(true);
  });

  it('should disable connect to distributor session when conditions are not satisifed 3', () => {
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    //component.connectionDetailsStore.updateSelectedDistributor('Test');
    component.connectionDetailsStore.updateSelectedEnvironment('Test');
    expect(component.isConnectToDistributorSessionDisabled()).toEqual(true);
  });

  it('should disable connect to distributor session when conditions are not satisifed 4', () => {
    component.connectionDetailsStore.updateSelectedEnvironment('Test');
    expect(component.isConnectToDistributorSessionDisabled()).toEqual(true);
  });

  it('should disable send messages button when conditions are not satisifed 1', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    expect(component.isSendMessagesButtonDisabled()).toEqual(true);
  });

  it('should disable send messages button when conditions are not satisifed 2', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    component.connectionDetailsStore.updateSelectedGatewayType('FIX');
    component.connectionDetailsStore.updateSelectedDistributor('Test');
    component.connectionDetailsStore.updateSelectedEnvironment('Test');
    expect(component.isSendMessagesButtonDisabled()).toEqual(true);
  });

  it('should enable disconnect button when conditions are  satisifed', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    expect(component.isDisconnectFromDistributorSessionDisabled()).toEqual(false);
  });

  it('should disable disconnect button when conditions are not satisifed', () => {
    expect(component.isDisconnectFromDistributorSessionDisabled()).toEqual(true);
  });

  it('should handle numeric input gracefully', () => {
    // eslint-disable-next-line
    const mockEvent = { target: { value: '1' } } as any;
    component.onMessageCountChange(mockEvent);
    expect(component.connectionDetailsStore.messagesCount()).toEqual(1);
  });

  it('should handle negative value by setting signal to 0', () => {
    // eslint-disable-next-line
    const mockEvent = { target: { value: '-1' } } as any;

    component.onMessageCountChange(mockEvent);
    expect(component.connectionDetailsStore.messagesCount()).toEqual(1);
  });

  it('should handle message frequency properly', () => {
    component.onMessageFrequencyChange('5');
    expect(component.connectionDetailsStore.messagesFrequency()).toEqual(5);
  });

  it('should handle message frequency with negative value properly', () => {
    component.onMessageFrequencyChange('-5');
    expect(component.connectionDetailsStore.messagesFrequency()).toEqual(0);
  });

  it('should connect to distributor session properly', () => {
    component.connectToDistributorSession();
    expect(component.connectionDetailsStore.distributorSocketConnectionStatus()).toEqual(
      ConnectionState.CONNECTING,
    );
  });

  it('should disconnect from distributor session properly', () => {
    component.connectToDistributorSession();
    component.disconnectFromDistributorSession();
    expect(component.connectionDetailsStore.distributorSocketConnectionStatus()).toEqual(
      ConnectionState.DISCONNECTED,
    );
  });

  it('should handle stop sending bulk messages', () => {
    component.stopSendingBulkMessages();
    expect(component.connectionDetailsStore.isBatchMessageTriggered()).toEqual(false);
  });

  it('should handle sending messages', () => {
    component.connectToDistributorSession();
    component.connectionDetailsStore.updateMessagesCount(10);
    component.connectionDetailsStore.updateMessagesFrequency(3);
    component.messagesStore.addMessage({
      id: 0,
      type: 'test',
      payload: 'test',
    });
    component.sendMessages();

    expect(component.connectionDetailsStore.isBatchMessageTriggered()).toEqual(true);
  });

  it('should handle add new message button disable when message batch is trigerred', () => {
    component.connectionDetailsStore.updateIsBatchMessageTriggered(true);
    expect(component.isAddNewMessageButtonDisabled()).toEqual(true);
  });
});
