import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectionState, Message } from '../../models/models';
import { MessagesStore } from '../../store/messages.store';
import { ConnectionDetailsStore } from '../../store/connection-details.store';
import { MessageEditorInitService } from '../../services/message-editor-init.service';
import { FixMessageConnectionService } from '../../services/fix-message-connection.service';
import { MessageFrequencyPipe } from '../../pipes/message-frequency.pipe';

import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-message-sender',
  imports: [
    MatSelectModule,
    MatDividerModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MessageFrequencyPipe,
  ],
  templateUrl: './message-sender.component.html',
  styleUrl: './message-sender.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageSenderComponent {
  readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  private messageEditorInitService = inject(MessageEditorInitService);
  private fixMessageService = inject(FixMessageConnectionService);
  public configService = inject(ConfigService);
  displayedColumns: string[] = ['type', 'payload', 'buttons'];
  frequency: number[] = [0, 1, 2, 3, 4, 5, 6];

  onAddNewMessageClick() {
    this.messageEditorInitService.openFixEditorModal('new', 'OINP');
  }

  onRowClick(row: Message) {
    this.messagesStore.updateEditedMessage(row);
    this.messageEditorInitService.openFixEditorModal('edit', 'OINP');
  }

  isSendMessagesButtonDisabled() {
    if (
      !this.fixMessageService.isDistribiutorSessonStarted() ||
      this.connectionDetailsStore.isBatchMessageTriggered()
    ) {
      return true;
    }

    if (
      !this.connectionDetailsStore?.selectedGatewayType() ||
      !this.connectionDetailsStore.selectedDistributor() ||
      !this.connectionDetailsStore.selectedEnvironment()
    ) {
      return true;
    }

    return this.messagesStore.distributorMessagesEntities().length === 0;
  }

  isConnectToDistributorSessionDisabled() {
    return (
      this.connectionDetailsStore?.isConnectToDistributorSessionDisabled() ||
      this.fixMessageService.simulatorEngineWsConnectionService.stateAsSignal() ===
      ConnectionState.CONNECTING
    );
  }

  isDisconnectFromDistributorSessionDisabled() {
    return !this.fixMessageService.isDistribiutorSessonStarted();
  }

  isModifyBulkParametersDisabled() {
    return this.connectionDetailsStore.isBatchMessageTriggered();
  }

  isAddNewMessageButtonDisabled() {
    return this.connectionDetailsStore.isAddNewMessageButtonDisabled();
  }

  showConnectToDistributorSessionButton() {
    return !this.fixMessageService.isDistribiutorSessonStarted();
  }

  showHints() {
    return this.connectionDetailsStore.showHints();
  }

  getRowHeight() {
    return '100px';
  }

  onDeleteMessageClick(message: Message) {
    this.messagesStore.deleteMessage(message.id);
  }

  onMessageCountChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const numberValue = parseFloat(inputElement.value);
    if (numberValue < 1) {
      this.connectionDetailsStore.updateMessagesCount(1);
      return;
    }

    this.connectionDetailsStore.updateMessagesCount(numberValue);
  }

  onMessageFrequencyChange(value: string) {
    const numberValue = parseFloat(value);
    if (numberValue < 0) {
      return;
    }

    this.connectionDetailsStore.updateMessagesFrequency(numberValue);
  }

  connectToDistributorSession() {
    this.fixMessageService.startConnection();
  }

  disconnectFromDistributorSession() {
    this.fixMessageService.disconnectFromSession();
  }

  stopSendingBulkMessages() {
    this.fixMessageService.stopSendingMessagesBatch();
    this.connectionDetailsStore.updateIsBatchMessageTriggered(false);
  }

  sendMessages() {
    if (this.connectionDetailsStore.messagesFrequency() > 0) {
      this.connectionDetailsStore.updateIsBatchMessageTriggered(true);
    }
    this.fixMessageService.sendOINPMessagesBatch();
  }

  showStopBatchButton() {
    return (
      this.fixMessageService.isDistribiutorSessonStarted() &&
      this.connectionDetailsStore.isBatchMessage()
    );
  }
}
