import { Component, inject, OnInit, effect } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MessagesStore } from '../../store/messages.store';
import { ConnectionDetailsStore } from '../../store/connection-details.store';
import { MatButtonModule } from '@angular/material/button';
import { MessageEditorInitService } from '../../services/message-editor-init.service';
import { ConnectionState, Template } from '../../models/models';
import { ConfigService } from '../../services/config.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { EnviromentAvaliableDistributors } from '../../models/fix-models';
import { FixMessageConverterService } from '../../services/fix-message-converter.service';

@Component({
  selector: 'app-connection-details-panel',
  imports: [
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './connection-details-panel.component.html',
  styleUrl: './connection-details-panel.component.scss',
})
export class ConnectionDetailsPanelComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  private fixMessageConverterService = inject(FixMessageConverterService);
  private messageEditorInitService = inject(MessageEditorInitService);
  public configService = inject(ConfigService);

  environments: string[] = [];
  distributors: string[] = [];
  allDistributors: EnviromentAvaliableDistributors[] = [];
  providers: string[] = [];
  errorIntervals: number[] = [0, 5, 10, 20];
  gateways: string[] = ['FIX'];

  TBKDTemplates: Template[] = [];
  ECNITemplates: Template[] = [];
  ErrorTemplates: Template[] = [];

  form = this.fb.group({
    environment: [''],
    gatewayType: ['FIX'],
    distributor: [''],
    provider: [''],
    useCustomProvider: [false],
    tbkdTemplate: [{ name: '', payload: '' } as Template],
    ecniTemplate: [{ name: '', payload: '' } as Template],
    errorFrequency: [0],
    merrTemplate: [{ name: '', payload: '' } as Template],
  });

  constructor() {
    this.setupFormSubscriptions();
    this.setupDisabledStateEffect();
  }

  private setupDisabledStateEffect() {
    effect(() => {
      const inputsDisabled = this.shouldInputsBeDisabled();
      const distributorDisabled = this.shouldDistributorFieldBeDisabled();
      const templatesDisabled = this.shouldTemplatesSelectPanelBeDisabled();

      // Environment and Gateway are disabled if any connection is active
      if (inputsDisabled) {
        this.form.controls.environment.disable({ emitEvent: false });
        this.form.controls.gatewayType.disable({ emitEvent: false });
      } else {
        this.form.controls.environment.enable({ emitEvent: false });
        this.form.controls.gatewayType.enable({ emitEvent: false });
      }

      // Distributor has its own logic
      if (distributorDisabled) {
        this.form.controls.distributor.disable({ emitEvent: false });
      } else {
        this.form.controls.distributor.enable({ emitEvent: false });
      }

      // Templates and frequency are disabled if provider is connected
      if (templatesDisabled) {
        this.form.controls.tbkdTemplate.disable({ emitEvent: false });
        this.form.controls.ecniTemplate.disable({ emitEvent: false });
        this.form.controls.errorFrequency.disable({ emitEvent: false });
        this.form.controls.merrTemplate.disable({ emitEvent: false });
      } else {
        this.form.controls.tbkdTemplate.enable({ emitEvent: false });
        this.form.controls.ecniTemplate.enable({ emitEvent: false });
        this.form.controls.errorFrequency.enable({ emitEvent: false });
        this.form.controls.merrTemplate.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.allDistributors = this.configService.distibutors ?? [];
    this.providers = this.configService.providers ?? [];
    this.environments = this.configService.environments ?? [];
    this.TBKDTemplates = this.configService.tbkdTemplates ?? [];
    this.ECNITemplates = this.configService.ecniTemplates ?? [];
    this.ErrorTemplates = this.configService.merrTemplates ?? [];

    // Initialize form with store values
    this.form.patchValue(
      {
        environment: this.connectionDetailsStore.selectedEnvironment(),
        gatewayType: this.connectionDetailsStore.selectedGatewayType() || 'FIX',
        distributor: this.connectionDetailsStore.selectedDistributor(),
        provider: this.connectionDetailsStore.selectedProvider(),
        errorFrequency: this.messagesStore.errorFrequency(),
      },
      { emitEvent: false },
    );

    // Sync initial distributors based on environment
    this.updateDistributorsList(this.form.controls.environment.value);
  }

  private setupFormSubscriptions() {
    this.form.controls.environment.valueChanges.pipe(takeUntilDestroyed()).subscribe(val => {
      this.updateDistributorsList(val);
      this.connectionDetailsStore.updateSelectedEnvironment(val);
      this.form.controls.distributor.setValue('', { emitEvent: true });
    });

    this.form.controls.gatewayType.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => this.connectionDetailsStore.updateSelectedGatewayType(val));

    this.form.controls.distributor.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => this.connectionDetailsStore.updateSelectedDistributor(val));

    this.form.controls.provider.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => this.connectionDetailsStore.updateSelectedProvider(val));

    this.form.controls.useCustomProvider.valueChanges.pipe(takeUntilDestroyed()).subscribe(val => {
      this.form.controls.provider.setValue('');
    });

    this.form.controls.tbkdTemplate.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val =>
        this.messagesStore.updateSelectedTBKDTemplate(this.validatePredefinedTemplate(val)),
      );

    this.form.controls.ecniTemplate.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val =>
        this.messagesStore.updateSelectedECNITemplate(this.validatePredefinedTemplate(val)),
      );

    this.form.controls.merrTemplate.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val =>
        this.messagesStore.updateSelectedMERRTemplate(this.validatePredefinedTemplate(val)),
      );

    this.form.controls.errorFrequency.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(val => this.messagesStore.updateSelectedErrorFrequency(val));
  }

  private updateDistributorsList(environmentType: string) {
    const distributorsonSelectedEnvironment = this.allDistributors.find(
      distributor => distributor.environmentName === environmentType,
    );
    this.distributors = distributorsonSelectedEnvironment?.avaliableDistributors ?? [];
  }

  validatePredefinedTemplate(template: Template): Template {
    if (!template.payload) return template;

    const updatedTemplate = this.fixMessageConverterService.convertTemplateToParamsList(
      template.payload,
      this.form.controls.distributor.value,
      this.form.controls.provider.value,
      false,
    );

    return {
      payload:
        this.fixMessageConverterService.convertParamsListToSerializedPayload(updatedTemplate),
      name: template.name,
    };
  }

  showHints() {
    return this.connectionDetailsStore.showHints();
  }

  isConnectButtonDisabled() {
    const { environment, gatewayType, provider } = this.form.getRawValue();
    return !environment || !gatewayType || !provider;
  }

  onCustomTBKDSelectClick() {
    if (this.messagesStore.editedTBKDMessage()?.payload) {
      this.messageEditorInitService.openFixEditorModal('edit', 'TBKD');
      return;
    }
    this.messageEditorInitService.openFixEditorModal('new', 'TBKD');
  }

  onCustomECNISelectClick() {
    if (this.messagesStore.editedECNIMessage()?.payload) {
      this.messageEditorInitService.openFixEditorModal('edit', 'ECNI');
      return;
    }
    this.messageEditorInitService.openFixEditorModal('new', 'ECNI');
  }

  onCustomMERRSelectClick() {
    if (this.messagesStore.editedErrorMessage()?.payload) {
      this.messageEditorInitService.openFixEditorModal('edit', 'MERR');
      return;
    }
    this.messageEditorInitService.openFixEditorModal('new', 'MERR');
  }

  formatSelectedErrorFrequency(frequency: number) {
    return frequency === 0 ? 'None' : frequency.toString();
  }

  shouldInputsBeDisabled() {
    return (
      this.connectionDetailsStore.distributorSocketConnectionStatus() ===
      ConnectionState.CONNECTED ||
      this.connectionDetailsStore.providerSocketConnectionStatus() === ConnectionState.CONNECTED
    );
  }

  shouldDistributorFieldBeDisabled() {
    return (
      this.connectionDetailsStore.distributorSocketConnectionStatus() ===
      ConnectionState.CONNECTED ||
      this.connectionDetailsStore.distributorSocketConnectionStatus() === ConnectionState.CONNECTING
    );
  }

  shouldTemplatesSelectPanelBeDisabled() {
    return (
      this.connectionDetailsStore.providerSocketConnectionStatus() === ConnectionState.CONNECTED
    );
  }

  distributorConnectionDetailsState() {
    switch (this.connectionDetailsStore.distributorSocketConnectionStatus()) {
      case ConnectionState.DISCONNECTED:
        return 'Disconnected';
      case ConnectionState.CONNECTING:
        return 'Connecting...';
      case ConnectionState.CONNECTED:
        return 'Connected';
      case ConnectionState.ERROR:
        return 'Error';
    }
  }

  providerConnectionDetailsState() {
    switch (this.connectionDetailsStore.providerSocketConnectionStatus()) {
      case ConnectionState.DISCONNECTED:
        return 'Disconnected';
      case ConnectionState.CONNECTING:
        return 'Connecting...';
      case ConnectionState.CONNECTED:
        return 'Listening';
      case ConnectionState.ERROR:
        return 'Error';
    }
  }
}
