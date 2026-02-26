import { MatTableModule } from '@angular/material/table';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { Property } from '../../models/fix-models';
import { NotificationDisplayService } from '../../services/notification-display.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { FixMessageConverterService } from '../../services/fix-message-converter.service';

export interface FixFieldKey {
  id: number;
  description: string;
}

@Component({
  selector: 'app-editable-fix-table',
  imports: [
    MatTableModule,
    CommonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  templateUrl: './editable-fix-table.component.html',
  styleUrl: './editable-fix-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableFixTableComponent {
  templatePropertiesSignal = model<Property[]>([]);
  canSaveMessageChanged = output<boolean>();
  editedRows = signal<Set<number>>(new Set());
  tempEdits = signal<Map<number, Property>>(new Map());
  private notificationDisplayService = inject(NotificationDisplayService);
  private fixMessageConverterService = inject(FixMessageConverterService);
  matchingFieldDescriptions = signal<FixFieldKey[]>([]);
  templatePropertiesData = computed(() => this.templatePropertiesSignal());
  displayedColumns: string[] = ['fieldId', 'description', 'fieldName', 'actions'];

  dataChangeEfect = effect(() => {
    const changedData = this.templatePropertiesSignal();
    this.canSaveMessageChanged.emit(changedData.length !== 0 && this.editedRows()?.size === 0);
  });

  getTempDescription(index: number) {
    return this.tempEdits()?.get(index)?.description ?? '';
  }

  addNewRow() {
    const id = Date.now();
    this.templatePropertiesSignal.set([
      { propertyKey: 0, propertyValue: '', rowId: id, isTemplateKeyValid: true, messages: [] },
      ...this.templatePropertiesSignal(),
    ]);
    this.startEdit(id);
  }

  filterFieldOptions(event: Event) {
    if (!event.target) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const keyValue = parseInt(input.value);
    if (!keyValue) {
      return;
    }

    const fixFieldNumberDescriptionOptions =
      this.fixMessageConverterService.validateFixFieldNumber(keyValue);

    if (!fixFieldNumberDescriptionOptions || fixFieldNumberDescriptionOptions.length === 0) {
      this.matchingFieldDescriptions.set([]);
      return;
    }

    this.matchingFieldDescriptions.set([
      { id: keyValue, description: fixFieldNumberDescriptionOptions[0].description },
    ]);
  }

  toggleEdit(index: number) {
    const currentEditedRowsState = new Set(this.editedRows());
    if (currentEditedRowsState.has(index)) {
      currentEditedRowsState.delete(index);
    } else {
      currentEditedRowsState.add(index);
    }
    this.editedRows.set(currentEditedRowsState);
  }

  isEditing(index: number): boolean {
    return this.editedRows().has(index);
  }

  startEdit(index: number) {
    const currentlyEditedRows = new Set(this.editedRows());
    currentlyEditedRows.add(index);
    this.editedRows.set(currentlyEditedRows);

    const editedRow = this.templatePropertiesSignal().find(sign => sign.rowId == index);
    if (!editedRow) {
      return;
    }
    const temp = new Map(this.tempEdits());
    temp.set(index, { ...editedRow });
    this.tempEdits.set(temp);
    this.canSaveMessageChanged.emit(false);
  }

  cancelEdit(index: number) {
    const currentlyEditedRows = new Set(this.editedRows());
    currentlyEditedRows.delete(index);
    this.editedRows.set(currentlyEditedRows);

    const temp = new Map(this.tempEdits());
    temp.delete(index);
    this.tempEdits.set(temp);
  }

  deleteRow(element: Property) {
    const updatedItems = this.templatePropertiesSignal().filter(
      item => item.rowId !== element.rowId,
    );
    this.templatePropertiesSignal.set(updatedItems);
  }

  formatDisplayWarnings(template: Property) {
    if (!template.messages || template.messages.length === 0) {
      return '';
    }

    return template.messages.join('\n');
  }

  saveEdit(index: number) {
    const editedRow = this.tempEdits().get(index);
    if (!editedRow) {
      return;
    }

    if (editedRow.propertyValue.includes('|')) {
      this.notificationDisplayService.showError(
        'Edited template contains not allowed symbol |',
        'Error',
      );
      return;
    }

    if (!editedRow.propertyKey || !editedRow.propertyValue || editedRow.propertyValue === '') {
      this.notificationDisplayService.showError('Field cannot be empty', 'Error');
      return;
    }

    let templatePropertiesForRename = [...this.templatePropertiesSignal()];
    const upd = templatePropertiesForRename.find(sign => sign.rowId == index);
    if (!upd) {
      return;
    }

    templatePropertiesForRename = templatePropertiesForRename.map(el => {
      if (el.rowId === editedRow.rowId) {
        return {
          ...editedRow,
        };
      } else {
        return el;
      }
    });

    this.templatePropertiesSignal.set(templatePropertiesForRename);

    this.cancelEdit(index);
    if (this.editedRows()?.size == 0) {
      this.canSaveMessageChanged.emit(true);
    }
  }

  updateTemp(index: number, field: keyof Property, event: Event) {
    if (!event.target) {
      return;
    }

    const input = event.target as HTMLInputElement;
    const currentTempEdits = new Map(this.tempEdits());
    const focusedTempEdit = currentTempEdits.get(index);
    if (focusedTempEdit && input.value) {
      currentTempEdits.set(index, {
        ...focusedTempEdit,
        [field]: field === 'propertyKey' ? parseInt(input.value) : input.value,
      });
      this.tempEdits.set(currentTempEdits);
    }
  }

  onOptionSelected(index: number, evt: MatAutocompleteSelectedEvent) {
    const matchingDescriptions = this.matchingFieldDescriptions().filter(
      el => el.id === evt.option.value,
    )[0]?.description;
    const temporaryEdits = new Map(this.tempEdits());
    const property = temporaryEdits.get(index);

    if (!property) {
      return;
    }

    temporaryEdits.set(index, { ...property, description: matchingDescriptions });
    this.tempEdits.set(temporaryEdits);
  }
}
