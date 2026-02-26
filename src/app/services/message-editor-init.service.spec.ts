import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { MessageEditorInitService } from './message-editor-init.service';

describe('MessageEditorInitService', () => {
  let service: MessageEditorInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageEditorInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
