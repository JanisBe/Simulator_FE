import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Template } from '../../models/models';
import { FixFieldKey, FixMessageEditorModalPayload, FixMessageType, Property, } from '../../models/fix-models';
import { FixMessageConnectionService } from '../../services/fix-message-connection.service';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { FiledropComponent } from '../filedrop/filedrop.component';
import { ConfigService } from '../../services/config.service';
import { EditableFixTableComponent } from '../editable-fix-table/editable-fix-table.component';
import { FixMessageConverterService } from '../../services/fix-message-converter.service';
import { ConnectionDetailsStore } from '../../store/connection-details.store';
import { FixMessagesService } from '../../services/fix-messages.service';

@Component({
  selector: 'app-fix-message-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FiledropComponent,
    EditableFixTableComponent,
  ],
  templateUrl: './fix-message-editor.component.html',
  styleUrl: './fix-message-editor.component.scss',
})
export class FixMessageEditorComponent implements OnInit {
  public fixMessageConnectionService = inject(FixMessageConnectionService);
  private configService = inject(ConfigService);
  private canSaveMessage = signal(true);
  editedMessageProperties: Property[] = [];
  private dialogRef = inject(MatDialogRef<FixMessageEditorComponent>);
  private fixMessageConverterService = inject(FixMessageConverterService);
  readonly connectionDetailsStore = inject(ConnectionDetailsStore);
  readonly fixMessagesService = inject(FixMessagesService);
  public data: FixMessageEditorModalPayload = inject(MAT_DIALOG_DATA);
  messageTemplates: Template[] = [];


  fieldDescriptionOptions: FixFieldKey[] = [];

  modalPayload: FixMessageEditorModalPayload = {
    modalMode: 'new',
    messageType: 'OINP',
  };

  handleMessageFileAdd(message: string) {
    if (message) {
      this.convertEmxFixMessageToParamsList(message);
    }
  }

  addMessage() {
    const messageType = this.modalPayload?.messageType ?? 'OINP';
    this.fixMessagesService.addMessage(this.editedMessageProperties, messageType);
    this.dialogRef.close();
  }

  canSaveMessageChanged(event: boolean) {
    this.canSaveMessage.set(event);
  }

  modifyMessage() {
    const messageType = this.modalPayload?.messageType ?? 'OINP';
    this.fixMessagesService.modifyMessage(this.editedMessageProperties, messageType);
    this.dialogRef.close();
  }

  onTemplateSelectionChange(val: MatSelectChange<string>) {
    this.convertTemplateToParamsList(val.value ?? '');
  }


  ngOnInit(): void {
    if (this.data) {
      this.modalPayload = this.data;
    }

    this.messageTemplates = this.getTemplates(this.modalPayload.messageType);
    if (this.modalPayload.messageType) {
      this.fixMessagesService.selectedMessageType = this.modalPayload.messageType;
    }

    if (this.modalPayload?.modalMode === 'edit') {
      const messageType = this.modalPayload?.messageType;

      if (!messageType) {
        return;
      }

      const selectedMesageType = this.fixMessagesService.getMessageForEdit(messageType);

      this.convertTemplateToParamsList(selectedMesageType.payload);
      this.fixMessagesService.selectedMessageType = selectedMesageType.type;
      return;
    }
  }

  getTemplates(messageType: FixMessageType): Template[] {
    if (!messageType) {
      return [];
    }

    switch (messageType) {
      case 'OINP':
        return this.configService.oinpTemplates ?? [];
      case 'TBKD':
        return this.configService.tbkdTemplates ?? [];
      case 'ECNI':
        return this.configService.ecniTemplates ?? [];
      case 'MERR':
        return this.configService.merrTemplates ?? [];
    }
  }

  saveMessage() {
    if (this.modalPayload?.modalMode === 'edit') {
      this.modifyMessage();
    } else {
      this.addMessage();
    }

    this.fixMessagesService.clearInputs();
  }

  closeDialog() {
    this.dialogRef.close();
    this.fixMessagesService.clearInputs();
  }

  isSaveMessageButtonDisabled() {
    if (this.modalPayload?.modalMode === 'edit') {
      if (!this.fixMessagesService.selectedMessageType) {
        return true;
      }
    }

    if (this.modalPayload?.modalMode === 'new') {
      if (!this.fixMessagesService.selectedMessageType) {
        return true;
      }
    }

    return !this.canSaveMessage();
  }

  convertTemplateToParamsList(val: string) {
    this.editedMessageProperties = this.fixMessageConverterService.convertTemplateToParamsList(
      val,
      this.connectionDetailsStore.selectedDistributor(),
      this.connectionDetailsStore.selectedProvider(),
      this.modalPayload?.messageType === 'OINP',
    );
  }

  convertEmxFixMessageToParamsList(message: string) {
    // 9480 is a key when certificate part is started EMX file has ~ symbol as separator
    const noCertificateMessagePart = message.split('\x019480')[0];
    this.editedMessageProperties = this.fixMessageConverterService.convertTemplateToParamsList(
      noCertificateMessagePart,
      this.connectionDetailsStore.selectedDistributor(),
      this.connectionDetailsStore.selectedProvider(),
      this.modalPayload?.messageType === 'OINP',
      '\x01',
    );
  }
}
