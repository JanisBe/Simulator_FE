import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationDisplayService {
  durationInSeconds = 5;
  private toastr = inject(ToastrService);

  showError(title: string, description: string) {
    this.toastr.error(title, description, {
      positionClass: 'toast-top-full-width',
    });
  }

  showSuccess(title: string, description: string) {
    this.toastr.success(title, description, {
      positionClass: 'toast-top-full-width',
    });
  }
}
