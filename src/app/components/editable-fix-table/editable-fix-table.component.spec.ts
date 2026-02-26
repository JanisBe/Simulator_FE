import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { EditableFixTableComponent } from './editable-fix-table.component';
import { provideHttpClient } from '@angular/common/http';
import { Property } from '../../models/fix-models';
import { ToastrModule } from 'ngx-toastr';

describe('EditableFixTableComponent', () => {
  let component: EditableFixTableComponent;
  let fixture: ComponentFixture<EditableFixTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditableFixTableComponent, ToastrModule.forRoot()],
      providers: [provideHttpClientTesting(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(EditableFixTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add row', () => {
    component.addNewRow();
    expect(component.templatePropertiesSignal().length).toEqual(1);
  });

  it('should delete added row', () => {
    component.addNewRow();
    component.deleteRow(component.templatePropertiesSignal()[0]);
    expect(component.templatePropertiesSignal().length).toEqual(0);
  });

  it('should handle key change', () => {
    component.updateTemp(1, 'propertyKey', {
      target: {
        // @ts-expect-error event handling for unit tests
        value: '-12000',
      },
    });

    expect(component.matchingFieldDescriptions().length).toEqual(0);
  });

  it('should  format warings when they are not empty', () => {
    const templateProperty: Property = {
      propertyKey: 0,
      propertyValue: '',

      isTemplateKeyValid: false,

      messages: ['test'],
      rowId: Date.now(),
      description: '',
    };
    const warnings = component.formatDisplayWarnings(templateProperty);
    expect(warnings).toEqual('test');
  });

  it('should start edit and update row', () => {
    const templateProperty: Property = {
      propertyKey: 40,
      propertyValue: 'before change',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);

    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.updateTemp(1234, 'propertyValue', { target: { value: 'after change' } });
    component.saveEdit(1234);

    expect(component.templatePropertiesSignal()[0].propertyValue).toEqual('after change');
  });

  it('should start edit and not update row when contains not allowed symbol', () => {
    const templateProperty: Property = {
      propertyKey: 40,
      propertyValue: 'before change',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);

    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.updateTemp(1234, 'propertyValue', { target: { value: 'after change|' } });
    component.saveEdit(1234);

    expect(component.templatePropertiesSignal()[0].propertyValue).toEqual('before change');
  });

  it('should start edit and not update row when contains empty value', () => {
    const templateProperty: Property = {
      propertyKey: 40,
      propertyValue: 'before change',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);

    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.updateTemp(1234, 'propertyValue', { target: { value: '' } });
    component.saveEdit(1234);

    expect(component.templatePropertiesSignal()[0].propertyValue).toEqual('before change');
  });

  it('should start edit and then add new row and then update row', () => {
    const templateProperty: Property = {
      propertyKey: 45,
      propertyValue: 'before change',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);
    component.addNewRow();

    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.updateTemp(1234, 'propertyValue', { target: { value: 'after change' } });
    component.saveEdit(1234);

    expect(component.templatePropertiesSignal()[1].propertyValue).toEqual('after change');
  });

  it('should find proper description', () => {
    const templateProperty: Property = {
      propertyKey: 8,
      propertyValue: 'test',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);

    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.filterFieldOptions({ target: { value: '8' } });
    expect(component.matchingFieldDescriptions()[0].id).toEqual(8);
    // @ts-expect-error event handling for unit tests
    component.onOptionSelected(1234, { option: { value: 8 } });

    expect(component.getTempDescription(1234)).toEqual('MessageHeader');

    component.saveEdit(1234);

    expect(component.templatePropertiesSignal()[0].description).toEqual('MessageHeader');
  });

  it('should not find proper description when there is no description for provided key', () => {
    const templateProperty: Property = {
      propertyKey: 8,
      propertyValue: 'test',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);

    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.filterFieldOptions({ target: { value: '99988' } });
    expect(component.matchingFieldDescriptions().length).toEqual(0);
  });

  it('should not find proper description when event target is wrong', () => {
    const templateProperty: Property = {
      propertyKey: 8,
      propertyValue: 'test',

      isTemplateKeyValid: false,
      rowId: 1234,
      description: '',
    };

    component.templatePropertiesSignal.set([templateProperty]);
    component.startEdit(1234);
    // @ts-expect-error event handling for unit tests
    component.filterFieldOptions({ wrongtarget: { wrongkey: '8' } });
    expect(component.matchingFieldDescriptions().length).toEqual(0);
  });

  it('save message button should be disabled for new message and properties in edit mode', () => {
    let canSave = false;
    component.templatePropertiesSignal.set([
      {
        propertyKey: 0,
        propertyValue: '',
        isTemplateKeyValid: false,

        messages: ['test'],
        rowId: Date.now(),
        description: '',
      },
    ]);

    component.addNewRow();
    component.canSaveMessageChanged.subscribe(res => (canSave = res));
    expect(canSave).toBe(false);
  });

  it('toggle edit should add new message to edit mode', () => {
    component.templatePropertiesSignal.set([
      {
        propertyKey: 0,
        propertyValue: '',
        isTemplateKeyValid: false,

        messages: ['test'],
        rowId: 1234,
        description: '',
      },
    ]);

    component.toggleEdit(1234);

    expect(component.editedRows().has(1234)).toBe(true);
  });

  it('toggle edit should delete new message when it was already in edit mode', () => {
    component.templatePropertiesSignal.set([
      {
        propertyKey: 0,
        propertyValue: '',
        isTemplateKeyValid: false,

        messages: ['test'],
        rowId: 1234,
        description: '',
      },
    ]);

    component.toggleEdit(1234);
    component.toggleEdit(1234);

    expect(component.editedRows().has(1234)).toBe(false);
  });
});
