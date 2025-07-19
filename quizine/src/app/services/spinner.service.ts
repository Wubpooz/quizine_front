import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  private _loading = new BehaviorSubject<boolean>(false);
  loading$ = this._loading.asObservable();

  private isSwalOpen = false;

  show(message: string = 'Chargement en cours…') {
    if (!this.isSwalOpen) {
      this.isSwalOpen = true;
      Swal.fire({
        theme: 'auto',
        title: 'Patientez…',
        text: message,
        allowOutsideClick: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        topLayer: true,
        // loaderHtml: '<div class="lds-dual-ring"></div>',
        // loaderHtml: '<div class="spinner-border text-primary"></div>',
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
    this._loading.next(true);
  }

  hide() {
    if (this.isSwalOpen) {
      Swal.close();
      this.isSwalOpen = false;
    }
    this._loading.next(false);
  }
}
