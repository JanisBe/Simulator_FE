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

  it('should display combined connection status with individual colors', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.DISCONNECTED);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const paragraphs = compiled.querySelectorAll('.connection-states p');

    expect(paragraphs[0].textContent).toContain('Distributor: Connected');
    expect(paragraphs[0].classList).toContain('status-connected');

    expect(paragraphs[1].textContent).toContain('Provider: Disconnected');
    expect(paragraphs[1].classList).toContain('status-disconnected');
  });

  it('should have correct colors for various states', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTING);
    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.ERROR);
    fixture.detectChanges();

    const paragraphs = fixture.nativeElement.querySelectorAll('.connection-states p');
    expect(paragraphs[0].classList).toContain('status-connecting');
    expect(paragraphs[1].classList).toContain('status-error');
  });
});
