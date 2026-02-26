import { inject } from '@angular/core';
import { SimulatorEngineWsConnectionService } from './simulator-engine-ws-connection.service';
import { filter, finalize, interval, Subject, Subscription, take, tap } from 'rxjs';
import { ConnectionState, StartStopConnectionMessage } from '../models/models';

export abstract class FixMessageBaseService {
  public simulatorEngineWsConnectionService = inject(SimulatorEngineWsConnectionService);
  private startStopSendingSubscription?: Subscription;
  private startStopListeningSubscription?: Subscription;
  private startStopErrorSubscription?: Subscription;
  protected timeoutTimerSubscription?: Subscription;
  private timeoutTimerValue = 0;
  private readonly CONNECTION_TIMEOUT = 15;
  protected readonly TARGET_COMPANY_ID = 'EMX';
  protected abstract updateFixConnectionStatus(connectionState: ConnectionState): void;
  protected abstract sendStartStopMessage(command: 'START' | 'STOP'): void;
  protected abstract handleError(message: { detail: string; description: string }): void;
  protected abstract startStopConnectionSubject(): Subject<StartStopConnectionMessage>;
  protected abstract setConnectionAsOpened(message: StartStopConnectionMessage): void;
  protected abstract unsubscribeAdditionalSubscriptions(): void;
  protected abstract disconnectFromSession(): void;

  startConnection() {
    this.listenToWebSocketErrors();
    if (
      this.simulatorEngineWsConnectionService.getConnectionStatusValue() !==
      ConnectionState.CONNECTED
    ) {
      this.simulatorEngineWsConnectionService.connect();
    }

    this.startFixConnection();
  }

  startFixConnection() {
    this.updateFixConnectionStatus(ConnectionState.CONNECTING);
    this.openStartStopErrorSubscription();
    this.openStartStopListeningSubscritpion();
    this.openStartStopSendingSubscription();
  }
  //if websocket session is active then start FIX connection
  private openStartStopSendingSubscription() {
    if (!this.startStopSendingSubscription || this.startStopSendingSubscription?.closed) {
      this.startStopSendingSubscription = this.simulatorEngineWsConnectionService
        .getConnectionStatusAsObservable()
        .pipe(
          filter(status => status === ConnectionState.CONNECTED),
          tap(() => this.updateFixConnectionStatus(ConnectionState.CONNECTING)),
          tap(() => this.startTimeoutTimerSubscription()),
        )
        .subscribe(() => this.sendStartStopMessage('START'));
    } else {
      this.startTimeoutTimerSubscription();
      this.sendStartStopMessage('START');
    }
  }

  private startTimeoutTimerSubscription() {
    this.timeoutTimerSubscription = interval(1000)
      .pipe(
        take(this.CONNECTION_TIMEOUT),
        tap(lastTimerValue => (this.timeoutTimerValue = lastTimerValue)),
        finalize(() => {
          if (this.timeoutTimerValue === this.CONNECTION_TIMEOUT - 1) {
            this.disconnectFromSession();
          }
          this.timeoutTimerValue = 0;
        }),
      )
      .subscribe();
  }

  private openStartStopErrorSubscription() {
    if (!this.startStopErrorSubscription || this.startStopListeningSubscription?.closed) {
      this.startStopErrorSubscription =
        this.simulatorEngineWsConnectionService.providerErrorsSubject
          .asObservable()
          .subscribe(message => this.handleError(message));
    }
  }

  private openStartStopListeningSubscritpion() {
    if (!this.startStopListeningSubscription || this.startStopListeningSubscription?.closed) {
      this.startStopListeningSubscription = this.startStopConnectionSubject()
        .asObservable()
        .pipe(tap(() => this.timeoutTimerSubscription?.unsubscribe()))
        .subscribe(message => this.setConnectionAsOpened(message));
    }
  }

  private listenToWebSocketErrors() {
    this.simulatorEngineWsConnectionService
      .getConnectionStatusAsObservable()
      .pipe(
        tap(status => {
          switch (status) {
            case ConnectionState.DISCONNECTED:
              this.unsubscribe();
              break;
            case ConnectionState.ERROR:
              this.unsubscribe();
              break;
          }
        }),
      )
      .subscribe();
  }

  protected unsubscribe() {
    if (this.startStopSendingSubscription) {
      this.startStopSendingSubscription.unsubscribe();
    }

    if (this.startStopListeningSubscription) {
      this.startStopListeningSubscription.unsubscribe();
    }

    if (this.startStopErrorSubscription) {
      this.startStopErrorSubscription.unsubscribe();
    }

    if (this.timeoutTimerSubscription) {
      this.timeoutTimerSubscription.unsubscribe();
    }

    this.unsubscribeAdditionalSubscriptions();
  }
}
