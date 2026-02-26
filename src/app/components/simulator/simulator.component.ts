import { Component, inject } from '@angular/core';
import { ConnectionDetailsPanelComponent } from '../connection-details-panel/connection-details-panel.component';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatToolbar } from '@angular/material/toolbar';
import { MessageReceiverComponent } from '../message-receiver/message-receiver.component';
import { MessageSenderComponent } from '../message-sender/message-sender.component';
import { ConnectionDetailsStore } from '../../store/connection-details.store';

@Component({
  selector: 'app-simulator',
  imports: [
    ConnectionDetailsPanelComponent,
    MatCheckbox,
    MatTab,
    MatTabGroup,
    MatToolbar,
    MessageReceiverComponent,
    MessageSenderComponent,
  ],
  templateUrl: './simulator.component.html',
  styleUrl: './simulator.component.scss',
})
export class SimulatorComponent {
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);

  onShowHintsCheckboxChange(event: MatCheckboxChange) {
    this.connectionDetailsStore.updateShowHints(event.checked);
  }
}
