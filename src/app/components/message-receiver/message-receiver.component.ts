import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ConnectionState } from '../../models/models';
import { MessagesStore } from '../../store/messages.store';
import { ConnectionDetailsStore } from '../../store/connection-details.store';
import { ProviderReplyService } from '../../services/provider-reply.service';

@Component({
  selector: 'app-message-receiver',
  imports: [
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatGridListModule,
    MatTableModule,
    MatDialogModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './message-receiver.component.html',
  styleUrl: './message-receiver.component.scss',
})
export class MessageReceiverComponent {
  readonly dialog = inject(MatDialog);
  readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  public providerReplyService = inject(ProviderReplyService);

  messages = toSignal(this.providerReplyService.data$, { initialValue: [] });

  displayedColumns: string[] = ['payload'];

  isConnectButtonDisabled = computed(() => {
    const state = this.providerReplyService?.simulatorEngineWsConnectionService?.stateAsSignal();
    const env = this.connectionDetailsStore.selectedEnvironment();
    const gateway = this.connectionDetailsStore.selectedGatewayType();
    const provider = this.connectionDetailsStore.selectedProvider();
    const ecniTemplate = this.messagesStore.selectedECNITemplate();
    const tbkdTemplate = this.messagesStore.selectedTBKDTemplate();
    const errorFrequency = this.messagesStore.errorFrequency();
    const merrTemplate = this.messagesStore.selectedMERRTemplate();

    return (
      state === ConnectionState.CONNECTING ||
      !env ||
      !gateway ||
      !provider ||
      ecniTemplate?.payload === '' ||
      tbkdTemplate?.payload === '' ||
      (errorFrequency !== 0 && merrTemplate.payload === '')
    );
  });

  isProviderSessionStarted = computed(
    () =>
      this.connectionDetailsStore.providerSocketConnectionStatus() === ConnectionState.CONNECTED,
  );

  startConnection() {
    this.providerReplyService.startConnection();
  }

  stopConnection() {
    this.providerReplyService.disconnectFromSession();
  }
}
