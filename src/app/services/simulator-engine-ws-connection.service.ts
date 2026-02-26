import { inject, Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConnectionState, StartStopConnectionMessage } from '../models/models';
import { FixQINPMessagesBatchRequest } from '../models/fix-models';
import { ConnectionDetailsStore } from '../store/connection-details.store';
import { NotificationDisplayService } from '../services/notification-display.service';
import { ConfigService } from '../services/config.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SimulatorEngineWsConnectionService {
  private client: Client;
  private state: BehaviorSubject<ConnectionState> = new BehaviorSubject<ConnectionState>(
    ConnectionState.DISCONNECTED,
  );

  public stateAsSignal = toSignal(this.state, { initialValue: ConnectionState.DISCONNECTED });
  public messageSubject: Subject<string> = new Subject<string>();
  public progressSubject: Subject<{ sentMessages: string; status: string }> = new Subject<{
    sentMessages: string;
    status: string;
  }>();
  public distributorStartStopConnectionSubject: Subject<StartStopConnectionMessage> =
    new Subject<StartStopConnectionMessage>();
  public providerStartStopConnectionSubject: Subject<StartStopConnectionMessage> =
    new Subject<StartStopConnectionMessage>();
  public distributorErrorsSubject: Subject<{ detail: string; description: string }> = new Subject<{
    detail: string;
    description: string;
  }>();
  public providerErrorsSubject: Subject<{ detail: string; description: string }> = new Subject<{
    detail: string;
    description: string;
  }>();

  public distributorStartStopSubscription?: StompSubscription;

  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  private readonly notificationDisplayService = inject(NotificationDisplayService);
  private readonly configService = inject(ConfigService);
  // value U1 indicates that it's OINP issue
  private readonly OINP_REPLY_INDICATOR = '35=U1';

  constructor() {
    const url = this.configService.stompWebSocketBaseurl
      ? this.configService.stompWebSocketBaseurl
      : environment.stompWebSocketBaseurl;
    this.client = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 0,
    });

    this.client.onConnect = () => {
      this.distributorStartStopSubscription = this.client.subscribe(
        environment.startStopInitiatorTopic,
        message => {
          this.distributorStartStopConnectionSubject.next(JSON.parse(message.body));
        },
      );

      this.client.subscribe(environment.startStopProviderTopic, message => {
        this.providerStartStopConnectionSubject.next(JSON.parse(message.body));
      });

      this.client.subscribe(environment.providerWebSocketTopic, message => {
        if (message.body.includes(this.OINP_REPLY_INDICATOR)) {
          this.messageSubject.next(message.body);
        }
      });

      this.client.subscribe(environment.progressWebSocketTopic, message => {
        this.progressSubject.next(JSON.parse(message.body));
      });

      this.client.subscribe(environment.errorsTopic, message => {
        const result = JSON.parse(message.body);

        const errorMessage = {
          detail: result.detail,
          description: result.title,
        };

        this.providerErrorsSubject.next(errorMessage);
        this.distributorErrorsSubject.next(errorMessage);
      });

      this.state.next(ConnectionState.CONNECTED);
    };

    this.client.onDisconnect = () => {
      this.client.deactivate();
      this.state.next(ConnectionState.DISCONNECTED);
    };

    this.client.onWebSocketClose = () => {
      this.client.deactivate();
      this.notificationDisplayService.showError('Error', 'Unable to connect to server');
      this.state.next(ConnectionState.ERROR);
      if (
        this.connectionDetailsStore.distributorSocketConnectionStatus() ===
          ConnectionState.CONNECTED ||
        this.connectionDetailsStore.distributorSocketConnectionStatus() ===
          ConnectionState.CONNECTING
      ) {
        this.connectionDetailsStore.updateDistributorConnectionStatus(ConnectionState.ERROR);
      }

      if (
        this.connectionDetailsStore.providerSocketConnectionStatus() ===
          ConnectionState.CONNECTED ||
        this.connectionDetailsStore.providerSocketConnectionStatus() === ConnectionState.CONNECTING
      ) {
        this.connectionDetailsStore.updateProviderConnectionStatus(ConnectionState.ERROR);
      }
    };

    this.client.onStompError = frame => {
      this.state.next(ConnectionState.ERROR);
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
  }

  connect() {
    if (this.getConnectionStatusValue() === ConnectionState.ERROR) {
      this.client.deactivate();
    }
    this.state.next(ConnectionState.CONNECTING);
    this.client.activate();
  }

  sendMessage(destination: string, body: object): void {
    this.client.publish({ destination, body: JSON.stringify(body) });
  }

  getConnectionStatusAsObservable() {
    return this.state.asObservable();
  }

  getConnectionStatusValue() {
    return this.state.getValue();
  }

  sendOinpMessagesBatch(request: FixQINPMessagesBatchRequest) {
    this.sendMessage(environment.distributorSendWebSocketTopic, request);
  }
}
