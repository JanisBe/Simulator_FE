import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ConnectionState, StartStopConnectionMessage } from '../models/models';
import { FixQINPMessagesBatchRequest } from '../models/fix-models';

import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class SimulatorEngineWsMockedConnectionService {
  connect() {
    this.state.next(ConnectionState.CONNECTING);
    this.state.next(ConnectionState.CONNECTED);
  }

  sendStartStopDistributorMessage(message: StartStopConnectionMessage) {
    this.distributorStartStopConnectionSubject.next(message);
  }

  sendStartStopProviderMessage(message: StartStopConnectionMessage) {
    this.providerStartStopConnectionSubject.next(message);
  }

  getConnectionStatusValue() {
    return this.state.getValue();
  }

  getConnectionStatusAsObservable() {
    return this.state.asObservable();
  }

  // eslint-disable-next-line
  sendMessage(destination: string, body: any): void { }

  // eslint-disable-next-line
  sendOinpMessagesBatch(request: FixQINPMessagesBatchRequest) { }

  private state: BehaviorSubject<ConnectionState> = new BehaviorSubject<ConnectionState>(
    ConnectionState.DISCONNECTED,
  );
  public stateAsSignal = toSignal(this.state, { initialValue: ConnectionState.DISCONNECTED });
  public messageSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public progressSubject: Subject<string> = new Subject<string>();
  public distributorStartStopConnectionSubject: BehaviorSubject<StartStopConnectionMessage> =
    new BehaviorSubject<StartStopConnectionMessage>({ connectionState: 'STARTED' });
  public providerStartStopConnectionSubject: BehaviorSubject<StartStopConnectionMessage> =
    new BehaviorSubject<StartStopConnectionMessage>({ connectionState: 'STARTED' });
  public distributorErrorsSubject: Subject<string> = new Subject<string>();
  public providerErrorsSubject: Subject<string> = new Subject<string>();
}
