import { Injectable, inject } from '@angular/core';
import { ConnectionState as ConnectionState, StartStopConnectionMessage } from '../models/models';
import { FixQINPMessagesBatchRequest } from '../models/fix-models';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationDisplayService } from './notification-display.service';

import { MessagesStore } from '../store/messages.store';
import { ConnectionDetailsStore } from '../store/connection-details.store';
import { FixMessageBaseService } from './fix-message-base.service';

@Injectable({
  providedIn: 'root',
})
export class FixMessageConnectionService extends FixMessageBaseService {
  public override disconnectFromSession(): void {
    this.sendStartStopMessage('STOP');
    this.unsubscribe();
    this.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.DISCONNECTED);
  }

  protected override updateFixConnectionStatus(connectionState: ConnectionState): void {
    this.connectionDetailsStore.updateDistributorConnectionStatus(connectionState);
  }

  protected override handleError(message: { detail: string; description: string }): void {
    this.notificationDisplayService.showError(
      message?.detail ?? 'Error',
      message?.description ?? '',
    );
    this.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.ERROR);
    if (this.timeoutTimerSubscription && !this.timeoutTimerSubscription.closed) {
      this.timeoutTimerSubscription.unsubscribe();
    }
  }

  protected override startStopConnectionSubject(): Subject<StartStopConnectionMessage> {
    return this.simulatorEngineWsConnectionService.distributorStartStopConnectionSubject;
  }

  protected override setConnectionAsOpened(message: StartStopConnectionMessage): void {
    if (message?.connectionState === 'STARTED') {
      this.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.CONNECTED);
    }

    if (message?.connectionState === 'STOPPED') {
      this.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.DISCONNECTED);
    }
  }

  protected override unsubscribeAdditionalSubscriptions(): void {
    /* empty */
  }

  readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  private notificationDisplayService = inject(NotificationDisplayService);

  sendOINPMessagesBatch() {
    const messages = this.messagesStore
      .distributorMessagesEntities()
      .map(message => message.payload);

    const request: FixQINPMessagesBatchRequest = {
      environment: this.connectionDetailsStore.selectedEnvironment() ?? '',
      senderCompId: this.connectionDetailsStore.selectedDistributor(),
      targetCompId: this.connectionDetailsStore.selectedProvider(),
      frequency: this.connectionDetailsStore.messagesFrequency(),
      messageCount: this.connectionDetailsStore.messagesCount(),
      messages: messages ?? [],
    };

    this.simulatorEngineWsConnectionService.sendOinpMessagesBatch(request);
    this.messagesStore.deleteAllMessages();
    this.simulatorEngineWsConnectionService.progressSubject.subscribe({
      next: el => this.handleDistributorMessagesProgressUpdate(el),
    });
  }

  handleDistributorMessagesProgressUpdate(el: { sentMessages: string; status: string }) {
    if (this.connectionDetailsStore.messagesCount() === 0) {
      this.notificationDisplayService.showSuccess('Message Was delivered succesfully', '');
      this.restetMessagesProgressUpdate();
      return;
    }

    const messageCount = parseInt(el.sentMessages) ?? 0;

    this.messagesStore.updateBatchMessagesCount(messageCount);
    this.messagesStore.updateBatchMessagesState(el.status);
  }

  restetMessagesProgressUpdate() {
    this.messagesStore.updateBatchMessagesCount(0);
    this.messagesStore.updateBatchMessagesState('');
  }

  sendStartStopMessage(command: 'START' | 'STOP') {
    this.simulatorEngineWsConnectionService.sendMessage(environment.startStopInitiatorSendTopic, {
      command: command,
      environment: this.connectionDetailsStore.selectedEnvironment() ?? '',
      senderCompId: this.connectionDetailsStore.selectedDistributor(),
      targetCompId: this.TARGET_COMPANY_ID,
    });
  }

  disconnectFromDistributorSession() {
    this.sendStartStopMessage('STOP');
    this.unsubscribe();
    this.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.DISCONNECTED);
  }

  stopSendingMessagesBatch() {
    this.simulatorEngineWsConnectionService.sendMessage(
      environment.stopEngineBulkMessagesTopic,
      {},
    );
    this.restetMessagesProgressUpdate();
  }

  isDistribiutorSessonStarted() {
    return (
      this.connectionDetailsStore.distributorSocketConnectionStatus() === ConnectionState.CONNECTED
    );
  }
}
