import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FixMessageEditorComponent } from './fix-message-editor.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';

describe('FixMessageEditorComponent', () => {
  let component: FixMessageEditorComponent;
  let fixture: ComponentFixture<FixMessageEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixMessageEditorComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MAT_DIALOG_DATA, useValue: {} },
        {
          provide: MatDialogRef,
          useValue: {
            // eslint-disable-next-line
            close: () => {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FixMessageEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should properly use converting template to params list', () => {
    component.convertTemplateToParamsList('4=test|5=test2|');
    expect(component.editedMessageProperties.length).toEqual(2);
    component.saveMessage();
  });

  it('should properly use converting template to params list', () => {
    component.handleMessageFileAdd('4=test|5=test2|');
    expect(component.editedMessageProperties.length).toEqual(1);
    component.saveMessage();
  });

  it('should properly use converting template to params list', () => {
    component.modalPayload.modalMode = 'edit';
    component.convertTemplateToParamsList('4=test|5=test2|');
    expect(component.editedMessageProperties.length).toEqual(2);
    component.saveMessage();
  });

  it('should properly use converting template to params list', () => {
    component.modalPayload.modalMode = 'edit';
    component.convertTemplateToParamsList('4=test|5=test2|');
    expect(component.editedMessageProperties.length).toEqual(2);
    component.modifyMessage();
  });

  it('should clear inputs', () => {
    component.fixMessagesService.selectedMessageType = 'test';
    component.closeDialog();
    expect(component.fixMessagesService.selectedMessageType).toEqual('');
  });

  it('save message button should be disabled for edit message and no message type selected', () => {
    component.modalPayload.modalMode = 'edit';
    expect(component.isSaveMessageButtonDisabled()).toBe(true);
  });

  it('save message button should be disabled for new message and no message type selected', () => {
    component.modalPayload.modalMode = 'new';
    expect(component.isSaveMessageButtonDisabled()).toBe(true);
  });

  it('save message button should be enabled for new message and properties not in edit mode', () => {
    component.modalPayload.modalMode = 'new';
    component.fixMessagesService.selectedMessageType = 'OINP';
    component.editedMessageProperties = [
      {
        propertyKey: 0,
        propertyValue: '',
        isTemplateKeyValid: false,
        messages: ['test'],
        rowId: Date.now(),
        description: '',
      },
    ];

    fixture.detectChanges();

    expect(component.isSaveMessageButtonDisabled()).toBe(false);
  });

  it('should convert emx mesage to params list without certificate', () => {
    const message =
      '8=FIX.4.1\x019480=3.0~SHA-256~RSA~CN=EUI Funds CA - G5,OU=EUI Funds,O=Euroclear UK & Ireland Limited,C=GB~283a33e044f1c8~';
    component.convertEmxFixMessageToParamsList(message);

    expect(component.editedMessageProperties[0].propertyKey).toEqual(8);
    expect(component.editedMessageProperties[0].propertyValue).toEqual('FIX.4.1');
  });

  it('should change selected template after selection change', () => {
    component.convertTemplateToParamsList('8=FIX.4.1|9=2365|35=U1|34=6|49=ZIN73|52=20190320');
    expect(component.editedMessageProperties[0].propertyKey).toEqual(8);
    expect(component.editedMessageProperties[0].propertyValue).toEqual('FIX.4.1');
  });

  it('should change selected temaplate after selection change', () => {
    component.convertTemplateToParamsList('');
    expect(component.editedMessageProperties.length).toEqual(1);
  });

  it('should init values', () => {
    component.modalPayload.messageType = 'OINP';
    component.modalPayload.modalMode = 'edit';

    component.ngOnInit();

    expect(component).toBeTruthy();
  });

  it('should init values', () => {
    component.modalPayload.modalMode = 'edit';

    component.ngOnInit();

    expect(component).toBeTruthy();
  });
});
