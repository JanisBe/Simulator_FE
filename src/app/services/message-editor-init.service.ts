import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FixMessageEditorComponent } from '../components/fix-message-editor/fix-message-editor.component';
import { MessageEditorModalMode } from '../models/models';
import { FixMessageEditorModalPayload, FixMessageType } from '../models/fix-models';

@Injectable({
  providedIn: 'root',
})
export class MessageEditorInitService {
  readonly dialog = inject(MatDialog);

  private getDialogConfig(
    editMode: MessageEditorModalMode,
    messageType: FixMessageType,
  ): MatDialogConfig<FixMessageEditorModalPayload> {
    const dialogConfig = new MatDialogConfig<FixMessageEditorModalPayload>();
    dialogConfig.disableClose = true;
    dialogConfig.minWidth = '800px';
    dialogConfig.data = { modalMode: editMode, messageType: messageType };
    return dialogConfig;
  }

  openFixEditorModal(dialogMode: MessageEditorModalMode, messageType: FixMessageType) {
    this.dialog.open(FixMessageEditorComponent, this.getDialogConfig(dialogMode, messageType));
  }
}
