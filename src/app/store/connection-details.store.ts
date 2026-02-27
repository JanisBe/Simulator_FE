import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { ConnectionState } from '../models/models';
import { computed } from '@angular/core';

interface ConnectionDetailsState {
  selectedEnvironment: string;
  selectedGatewayType: string;
  selectedDistributor: string;
  selectedProvider: string;
  messagesFrequency: number;
  messagesCount: number;
  isBatchMessageTriggered: boolean;
  distributorSocketConnectionStatus: ConnectionState;
  providerSocketConnectionStatus: ConnectionState;
  showHints: boolean;
}

const initialState: ConnectionDetailsState = {
  distributorSocketConnectionStatus: ConnectionState.DISCONNECTED,
  providerSocketConnectionStatus: ConnectionState.DISCONNECTED,
  selectedEnvironment: '',
  selectedGatewayType: 'FIX',
  selectedDistributor: '',
  selectedProvider: '',
  messagesFrequency: 0,
  messagesCount: 1,
  isBatchMessageTriggered: false,
  showHints: false,
};

export const ConnectionDetailsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(
    ({
      messagesFrequency,
      isBatchMessageTriggered,
      selectedDistributor,
      selectedGatewayType,
      selectedEnvironment,
      distributorSocketConnectionStatus,
    }) => ({
      isBatchMessage: computed(() => messagesFrequency() >= 1 && isBatchMessageTriggered()),
      isConnectToDistributorSessionDisabled: computed(
        () =>
          !selectedGatewayType() ||
          !selectedDistributor() ||
          !selectedEnvironment() ||
          distributorSocketConnectionStatus() === ConnectionState.CONNECTING,
      ),
      isAddNewMessageButtonDisabled: computed(
        () =>
          isBatchMessageTriggered() ||
          !selectedGatewayType() ||
          !selectedDistributor() ||
          !selectedEnvironment(),
      ),
    }),
  ),

  withMethods(store => ({
    updateSelectedEnvironment(environment: string) {
      patchState(store, () => ({ selectedEnvironment: environment }));
    },
    updateSelectedGatewayType(gatewayType: string) {
      patchState(store, () => ({ selectedGatewayType: gatewayType }));
    },
    updateSelectedDistributor(distributor: string) {
      patchState(store, () => ({ selectedDistributor: distributor }));
    },
    updateSelectedProvider(provider: string) {
      patchState(store, () => ({ selectedProvider: provider }));
    },
    updateMessagesFrequency(frequency: number) {
      patchState(store, () => ({ messagesFrequency: frequency }));
    },
    updateMessagesCount(count: number) {
      patchState(store, () => ({ messagesCount: count }));
    },
    updateIsBatchMessageTriggered(isTriggered: boolean) {
      patchState(store, () => ({ isBatchMessageTriggered: isTriggered }));
    },
    updateShowHints(showHints: boolean) {
      patchState(store, () => ({ showHints: showHints }));
    },
    updateDistributorConnectionStatus(connectionStatus: ConnectionState) {
      patchState(store, () => ({ distributorSocketConnectionStatus: connectionStatus }));
    },
    updateProviderConnectionStatus(connectionStatus: ConnectionState) {
      patchState(store, () => ({ providerSocketConnectionStatus: connectionStatus }));
    },
  })),
);
