import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ToastrModule } from 'ngx-toastr';
import { SimulatorEngineWsConnectionService } from './simulator-engine-ws-connection.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SimulatorEngineWsMockedConnectionService } from './simulator-engine-ws-mocked-connection.service';
import { ConnectionState } from '../models/models';

describe('SimulatorEngineWsConnectionService', () => {
  let service: SimulatorEngineWsMockedConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      providers: [
        provideAnimations(),
        {
          provide: SimulatorEngineWsConnectionService,
          useClass: SimulatorEngineWsMockedConnectionService,
        },
      ],
    });
    service = TestBed.inject(SimulatorEngineWsMockedConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should disconnect from distributor session properly', () => {
    service.connect();
    expect(service.getConnectionStatusValue()).toEqual(ConnectionState.CONNECTED);
  });
});
