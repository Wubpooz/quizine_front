import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _isOpen = new BehaviorSubject<boolean>(!this.isMobile());
  isOpen$ = this._isOpen.asObservable();

  constructor() {
    // Optionally, listen to window resize events to update sidebar state
    window.addEventListener('resize', () => {
      if (this.isMobile()) {
        this.setOpen(false);
      }
    });
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768; // Adjust breakpoint as needed
  }

  toggle() {
    this._isOpen.next(!this._isOpen.value);
  }

  setOpen(open: boolean) {
    this._isOpen.next(open);
  }
}