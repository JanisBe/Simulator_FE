import { Injectable, signal, inject } from '@angular/core';
import { BehaviorSubject, Subscription, tap, delay, Subject } from 'rxjs';
import { ConnectionState, ReceivedMessage, StartStopConnectionMessage } from '../models/models';
import { NotificationDisplayService } from '../services/notification-display.service';
import { MessagesStore } from '../store/messages.store';
import { ConnectionDetailsStore } from '../store/connection-details.store';
import { environment } from '../../environments/environment';
import { FixMessageType, FixQINPMessagesBatchRequest } from '../models/fix-models';
import { FixMessageBaseService } from './fix-message-base.service';

@Injectable({
  providedIn: 'root',
})
export class ProviderReplyService extends FixMessageBaseService {
  messagesSubject = new BehaviorSubject<ReceivedMessage[]>([]);
  data$ = this.messagesSubject.asObservable();
  storedMessagesLimit = 35;
  messagesCounter = signal(0);
  private readonly messagesStore = inject(MessagesStore);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  private readonly notificationDisplayService = inject(NotificationDisplayService);
  errorMessageCounter = 0;
  private replySubscription?: Subscription;

  protected override updateFixConnectionStatus(connectionState: ConnectionState): void {
    this.connectionDetailsStore.updateProviderConnectionStatus(connectionState);
  }

  protected override handleError(message: { detail: string; description: string }): void {
    this.notificationDisplayService.showError(
      message?.detail ?? 'Error',
      message?.description ?? '',
    );
    this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.ERROR);
    if (this.timeoutTimerSubscription && !this.timeoutTimerSubscription.closed) {
      this.timeoutTimerSubscription.unsubscribe();
    }
  }
  protected override startStopConnectionSubject(): Subject<StartStopConnectionMessage> {
    return this.simulatorEngineWsConnectionService.providerStartStopConnectionSubject;
  }

  protected override setConnectionAsOpened(message: StartStopConnectionMessage): void {
    if (message?.connectionState !== 'STARTED') {
      this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.DISCONNECTED);
      return;
    }
    if (
      this.connectionDetailsStore.providerSocketConnectionStatus() !== ConnectionState.CONNECTED
    ) {
      if (!this.replySubscription || this.replySubscription?.closed) {
        this.connectToProviderReplyWsSession();
      }
    }
    this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.CONNECTED);
  }

  protected override unsubscribeAdditionalSubscriptions(): void {
    if (this.replySubscription) {
      this.replySubscription?.unsubscribe();
    }
  }

  public override disconnectFromSession(): void {
    this.sendStartStopMessage('STOP');
    this.unsubscribe();
    this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.DISCONNECTED);
  }

  connectToProviderReplyWsSession() {
    this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.CONNECTED);
    if (!this.replySubscription || this.replySubscription?.closed) {
      this.replySubscription = this.simulatorEngineWsConnectionService.messageSubject
        .pipe(
          tap(() => this.handleMesageTBKDReply()),
          delay(1000),
          tap(() => this.handleMesageECNIReply()),
        )
        .subscribe({
          next: message => this.addMessageToList(message),
        });
    }
  }

  sendStartStopMessage(command: 'START' | 'STOP') {
    this.simulatorEngineWsConnectionService.sendMessage(environment.startStopProviderSendTopic, {
      command: command,
      environment: this.connectionDetailsStore.selectedEnvironment() ?? '',
      senderCompId: this.connectionDetailsStore.selectedProvider(),
      targetCompId: this.TARGET_COMPANY_ID,
    });
  }

  disconnectFromProviderWsSession() {
    this.sendStartStopMessage('STOP');
    this.unsubscribe();
    this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.DISCONNECTED);
  }

  private addMessageToList(message: string) {
    this.messagesCounter.update(value => value + 1);

    if (this.messagesCounter() > this.storedMessagesLimit) {
      return;
    }

    const ms: ReceivedMessage = {
      payload: message,
    };

    const currentData = this.messagesSubject.value;
    this.messagesSubject.next([...currentData, ms]);
  }

  private createReplyMessage(messageType: FixMessageType): FixQINPMessagesBatchRequest {
    return {
      environment: this.connectionDetailsStore.selectedEnvironment() ?? '',
      senderCompId: this.connectionDetailsStore.selectedDistributor(),
      targetCompId: this.connectionDetailsStore.selectedProvider(),
      frequency: 0,
      messageCount: 1,
      messages: [this.getReplyMessage(messageType)],
    };
  }

  private getReplyMessage(messageType: FixMessageType) {
    switch (messageType) {
      case 'TBKD':
        return this.messagesStore.selectedTBKDTemplate()?.payload;
      case 'ECNI':
        return this.messagesStore.selectedECNITemplate()?.payload;
      case 'MERR':
        return this.messagesStore.selectedMERRTemplate()?.payload;
      default:
        return this.messagesStore.selectedTBKDTemplate()?.payload;
    }
  }

  private getTBKDOrMERRReplyByErrorCounter() {
    return this.messagesStore.errorFrequency() !== 0 &&
      this.errorMessageCounter % this.messagesStore.errorFrequency() === 0
      ? this.createReplyMessage('MERR')
      : this.createReplyMessage('TBKD');
  }

  private handleMesageTBKDReply() {
    this.simulatorEngineWsConnectionService.sendMessage(
      environment.distributorSendWebSocketTopic,
      this.getTBKDOrMERRReplyByErrorCounter(),
    );

    this.errorMessageCounter++;
  }

  private handleMesageECNIReply() {
    this.simulatorEngineWsConnectionService.sendMessage(
      environment.distributorSendWebSocketTopic,
      this.createReplyMessage('ECNI'),
    );
  }
}
