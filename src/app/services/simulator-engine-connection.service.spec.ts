import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { SimulatorEngineConnectionService } from './simulator-engine-connection.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('SimulatorEngineConnectionService', () => {
  let service: SimulatorEngineConnectionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SimulatorEngineConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
