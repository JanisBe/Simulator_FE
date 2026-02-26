import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { SimulatorEngineWsConnectionService } from './simulator-engine-ws-connection.service';
import { SimulatorEngineWsMockedConnectionService } from './simulator-engine-ws-mocked-connection.service';
import { FixMessageConnectionService } from './fix-message-connection.service';
import { ConnectionState } from '../models/models';
import { ToastrModule } from 'ngx-toastr';

describe('FixMessageService', () => {
  let service: FixMessageConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [
        provideHttpClientTesting(),
        provideHttpClient(),
        {
          provide: SimulatorEngineWsConnectionService,
          useClass: SimulatorEngineWsMockedConnectionService,
        },
      ],
    });
    service = TestBed.inject(FixMessageConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should clean message list after sending messages', () => {
    service.connectionDetailsStore.updateSelectedDistributor('ZIN70');
    service.connectionDetailsStore.updateSelectedProvider('ZIN02');
    service.messagesStore.addMessage({
      id: 1,
      type: 'OINP',
      payload: '1234',
    });

    service.sendOINPMessagesBatch();
    expect(service.messagesStore.distributorMessagesEntities().length).toEqual(0);
  });

  it('should handle update messages count', () => {
    service.connectionDetailsStore.updateMessagesCount(6);
    service.handleDistributorMessagesProgressUpdate({ sentMessages: '3', status: 'PROGRESS' });
    expect(service.messagesStore.batchMessagesCount()).toEqual(3);
  });

  it('should handle connecting to distributor session', () => {
    service.startFixConnection();
    expect(service.connectionDetailsStore.distributorSocketConnectionStatus()).toEqual(
      ConnectionState.CONNECTED,
    );
  });

  it('should handle disconnecting to distributor session', () => {
    service.startFixConnection();
    service.disconnectFromSession();
    expect(service.connectionDetailsStore.distributorSocketConnectionStatus()).toEqual(
      ConnectionState.DISCONNECTED,
    );
  });

  it('should handlestop sending messages batch', () => {
    service.connectionDetailsStore.updateIsBatchMessageTriggered(true);
    service.stopSendingMessagesBatch();
    service.connectionDetailsStore.updateIsBatchMessageTriggered(false);
    expect(service.connectionDetailsStore.isBatchMessageTriggered()).toEqual(false);
  });
});
