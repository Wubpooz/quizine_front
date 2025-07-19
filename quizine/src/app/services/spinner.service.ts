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
        title: 'Patientez…',
        html: message,
        allowOutsideClick: false,
        showConfirmButton: false,
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
