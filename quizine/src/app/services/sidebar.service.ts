import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _isOpen = new BehaviorSubject<boolean>(this.getInitialState());
  isOpen$ = this._isOpen.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      if (this.isMobile()) {
        this.setOpen(false);
      }
    });

    this.isOpen$.subscribe(open => {
      localStorage.setItem('sidebarOpen', String(open));
    });
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  private getInitialState(): boolean {
    const stored = localStorage.getItem('sidebarOpen');
    return stored === null ? !this.isMobile() : stored === 'true';
  }

  toggle() {
    this._isOpen.next(!this._isOpen.value);
  }

  setOpen(open: boolean) {
    this._isOpen.next(open);
  }
}