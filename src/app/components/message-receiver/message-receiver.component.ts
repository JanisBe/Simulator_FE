import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ConnectionState, ReceivedMessage } from '../../models/models';
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
export class MessageReceiverComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  public providerReplyService = inject(ProviderReplyService);

  ngOnInit(): void {
    this.providerReplyService.data$.subscribe(data => (this.messages = data));
  }

  messages: ReceivedMessage[] = [];

  displayedColumns: string[] = ['payload'];

  startConnection() {
    this.providerReplyService.startConnection();
  }

  stopConnection() {
    this.providerReplyService.disconnectFromSession();
  }

  isConnectButtonDisabled() {
    return (
      this.providerReplyService?.simulatorEngineWsConnectionService?.stateAsSignal() ===
        ConnectionState.CONNECTING ||
      !this.connectionDetailsStore.selectedEnvironment() ||
      !this.connectionDetailsStore.selectedGatewayType() ||
      !this.connectionDetailsStore.selectedProvider() ||
      this.messagesStore.selectedECNITemplate()?.payload === '' ||
      this.messagesStore.selectedTBKDTemplate()?.payload === '' ||
      (this.messagesStore.errorFrequency() !== 0 &&
        this.messagesStore.selectedMERRTemplate().payload === '')
    );
  }

  isProviderSessionStarted() {
    return (
      this.connectionDetailsStore.providerSocketConnectionStatus() === ConnectionState.CONNECTED
    );
  }
}
