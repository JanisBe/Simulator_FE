import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimulatorComponent } from './simulator.component';
import { beforeEach, describe, expect, it } from 'vitest';
import { ToastrModule } from 'ngx-toastr';
import { ConnectionState } from '../../models/models';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SimulatorComponent', () => {
  let component: SimulatorComponent;
  let fixture: ComponentFixture<SimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulatorComponent, ToastrModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display combined connection status', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.DISCONNECTED);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const connectionStatesDiv = compiled.querySelector('.connection-states');
    expect(connectionStatesDiv?.textContent).toContain('Distributor: Connected');
    expect(connectionStatesDiv?.textContent).toContain('Provider: Disconnected');
    expect(connectionStatesDiv?.classList).toContain('status-disconnected');
    expect(connectionStatesDiv?.querySelectorAll('p').length).toBe(2);
  });

  it('should have connecting color when either is connecting', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTING);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const connectionStatesDiv = compiled.querySelector('.connection-states');
    expect(connectionStatesDiv?.classList).toContain('status-connecting');
  });

  it('should have connected color when both are connected', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.CONNECTED);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const connectionStatesDiv = compiled.querySelector('.connection-states');
    expect(connectionStatesDiv?.classList).toContain('status-connected');
  });
});
