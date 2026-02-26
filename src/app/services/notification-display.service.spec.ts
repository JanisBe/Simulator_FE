import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ToastrModule } from 'ngx-toastr';
import { NotificationDisplayService } from './notification-display.service';

describe('NotificationDisplayService', () => {
  let service: NotificationDisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
    });
    service = TestBed.inject(NotificationDisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
