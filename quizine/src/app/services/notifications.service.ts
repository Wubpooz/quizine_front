import { Injectable } from "@angular/core";
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    readonly NOTIF_STYLE: Partial<IndividualConfig> = {
        closeButton: true,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 5000,
        extendedTimeOut: 1000,
        easing: "swing"
    };

  constructor(private toastr: ToastrService) {}

  success(message: string, title?: string) {
    this.toastr.success(message, title || 'Success', this.NOTIF_STYLE);
  }

  error(message: string, title?: string) {
    this.toastr.error(message, title || 'Error', this.NOTIF_STYLE);
  }

  info(message: string, title?: string) {
    this.toastr.info(message, title || 'Info', this.NOTIF_STYLE);
  }

  warning(message: string, title?: string) {
    this.toastr.warning(message, title || 'Warning', this.NOTIF_STYLE);
  }

  clear() {
    this.toastr.clear();
  }


  // Add fullscreen notifications
}