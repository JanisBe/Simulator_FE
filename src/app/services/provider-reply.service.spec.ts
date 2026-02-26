import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProviderReplyService } from './provider-reply.service';
import { ConnectionState } from '../models/models';
import { SimulatorEngineWsConnectionService } from './simulator-engine-ws-connection.service';
import { SimulatorEngineWsMockedConnectionService } from './simulator-engine-ws-mocked-connection.service';
import { ToastrModule } from 'ngx-toastr';

describe('ProviderReplyService', () => {
  let service: ProviderReplyService;
  let wsMockedService: SimulatorEngineWsMockedConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [
        {
          provide: SimulatorEngineWsConnectionService,
          useClass: SimulatorEngineWsMockedConnectionService,
        },
      ],
    });
    service = TestBed.inject(ProviderReplyService);
    wsMockedService = TestBed.inject(SimulatorEngineWsMockedConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be connected after connection to provider session', () => {
    service.startConnection();
    wsMockedService.sendStartStopProviderMessage({ connectionState: 'STARTED' });
    expect(service.connectionDetailsStore.providerSocketConnectionStatus()).toEqual(
      ConnectionState.CONNECTING,
    );
  });

  it('should be connected after connection to provider session and connecting to reply', async () => {
    vi.useFakeTimers();

    service.startConnection();
    service.connectToProviderReplyWsSession();

    vi.advanceTimersByTime(3000);

    await Promise.resolve();

    expect(service.connectionDetailsStore.providerSocketConnectionStatus()).toEqual(
      ConnectionState.CONNECTED,
    );

    vi.useRealTimers();
  });

  it('should start connecting after connection to provider session', () => {
    service.startConnection();
    service.disconnectFromSession();
    expect(service.connectionDetailsStore.providerSocketConnectionStatus()).toEqual(
      ConnectionState.DISCONNECTED,
    );
  });
});
