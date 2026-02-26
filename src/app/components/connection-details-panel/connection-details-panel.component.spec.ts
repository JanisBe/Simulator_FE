import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ConnectionDetailsPanelComponent } from './connection-details-panel.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ConnectionState } from '../../models/models';

describe('ConnectionDetailsPanelComponent', () => {
  let component: ConnectionDetailsPanelComponent;
  let fixture: ComponentFixture<ConnectionDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionDetailsPanelComponent, ToastrModule.forRoot()],
      providers: [provideHttpClientTesting(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update selected error frequency', () => {
    component.form.controls.errorFrequency.setValue(5);
    expect(component.messagesStore.errorFrequency()).toEqual(5);
  });

  it('should update selected error template', () => {
    component.form.controls.merrTemplate.setValue({
      name: 'test',
      payload: '4=test|',
    });

    expect(component.messagesStore.selectedMERRTemplate().name).toEqual('test');
    expect(component.messagesStore.selectedMERRTemplate().payload).toEqual('4=test|');
  });

  it('should update selected ECNI template', () => {
    component.form.controls.ecniTemplate.setValue({
      name: 'test',
      payload: '4=test|',
    });

    expect(component.messagesStore.selectedECNITemplate().name).toEqual('test');
    expect(component.messagesStore.selectedECNITemplate().payload).toEqual('4=test|');
  });

  it('should update selected TBKD template', () => {
    component.form.controls.tbkdTemplate.setValue({
      name: 'test',
      payload: '4=test|',
    });

    expect(component.messagesStore.selectedTBKDTemplate().name).toEqual('test');
    expect(component.messagesStore.selectedTBKDTemplate().payload).toEqual('4=test|');
  });

  it('should update selected distributor template', () => {
    component.form.controls.distributor.setValue('ZIN70');

    expect(component.connectionDetailsStore.selectedDistributor()).toEqual('ZIN70');
  });

  it('should update selected provider template', () => {
    component.form.controls.provider.setValue('ZIN70');

    expect(component.connectionDetailsStore.selectedProvider()).toEqual('ZIN70');
  });

  it('should update selected environment template', () => {
    component.form.controls.environment.setValue('BETA');

    expect(component.connectionDetailsStore.selectedEnvironment()).toEqual('BETA');
  });

  it('should update selected gateway template', () => {
    component.form.controls.gatewayType.setValue('FIX');

    expect(component.connectionDetailsStore.selectedGatewayType()).toEqual('FIX');
  });

  it('should disable connect button if only gateway type is selected', () => {
    component.form.controls.gatewayType.setValue('FIX');
    expect(component.isConnectButtonDisabled()).toBe(true);
  });

  it('should enable connect button if gateway type, environment and provider is selected', () => {
    component.form.controls.gatewayType.setValue('FIX');
    component.form.controls.environment.setValue('BETA');
    component.form.controls.provider.setValue('ZIN70');
    expect(component.isConnectButtonDisabled()).toBe(false);
  });

  it('edited ECNI message should be updated', () => {
    component.messagesStore.updateEditedECNIMessage({
      id: 0,
      payload: 'test=test',
      type: 'OINP',
    });
    component.onCustomECNISelectClick();
    expect(component.messagesStore.editedECNIMessage().payload).toEqual('test=test');
  });

  it('new ECNI message should be updated', () => {
    component.onCustomECNISelectClick();
    expect(component.messagesStore.editedECNIMessage().payload).toEqual('');
  });

  it('edited TBKD message should be updated', () => {
    component.messagesStore.updateEditedTBKDMessage({
      id: 0,
      payload: 'test=test',
      type: 'TBKD',
    });
    component.onCustomTBKDSelectClick();

    expect(component.messagesStore.editedTBKDMessage().payload).toEqual('test=test');
  });

  it('new TBKD message should be updated', () => {
    component.onCustomTBKDSelectClick();
    expect(component.messagesStore.editedTBKDMessage().payload).toEqual('');
  });

  it('edited MERR message should be updated', () => {
    component.messagesStore.updateEditedErrorMessage({
      id: 0,
      payload: 'test=test',
      type: 'MERR',
    });
    component.onCustomMERRSelectClick();
    expect(component.messagesStore.editedErrorMessage().payload).toEqual('test=test');
  });

  it('new MERR message should be updated', () => {
    component.onCustomMERRSelectClick();
    expect(component.messagesStore.editedErrorMessage().payload).toEqual('');
  });

  it('use custom provider should be updated', () => {
    component.form.controls.useCustomProvider.setValue(true);
    expect(component.form.controls.useCustomProvider.value).toEqual(true);
  });

  it('should return proper distributor connection state', () => {
    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.ERROR);
    expect(component.distributorConnectionDetailsState()).toEqual('Error');

    component.connectionDetailsStore.updateDistributorConnectionStatus(
      ConnectionState.DISCONNECTED,
    );
    expect(component.distributorConnectionDetailsState()).toEqual('Disconnected');

    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    expect(component.distributorConnectionDetailsState()).toEqual('Connected');

    component.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTING);
    expect(component.distributorConnectionDetailsState()).toEqual('Connecting...');
  });

  it('should return proper provider connection state', () => {
    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.ERROR);
    expect(component.providerConnectionDetailsState()).toEqual('Error');

    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.DISCONNECTED);
    expect(component.providerConnectionDetailsState()).toEqual('Disconnected');

    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.CONNECTED);
    expect(component.providerConnectionDetailsState()).toEqual('Listening');

    component.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.CONNECTING);
    expect(component.providerConnectionDetailsState()).toEqual('Connecting...');
  });
});
