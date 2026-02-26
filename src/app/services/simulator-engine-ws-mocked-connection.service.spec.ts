import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SimulatorEngineWsMockedConnectionService } from './simulator-engine-ws-mocked-connection.service';

describe('SimulatorEngineWsMockedConnectionService', () => {
  let service: SimulatorEngineWsMockedConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatorEngineWsMockedConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
