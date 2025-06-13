import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDarkMode = false;

  constructor() {
    const darkPref = localStorage.getItem('darkMode');
    this._isDarkMode = darkPref === 'true';
    this.applyDarkMode();
  }

  get isDarkMode() {
    return this._isDarkMode;
  }

  toggleDarkMode() {
    this._isDarkMode = !this._isDarkMode;
    localStorage.setItem('darkMode', String(this._isDarkMode));
    this.applyDarkMode();
  }

  applyDarkMode() {
    const html = document.documentElement;
    if (this._isDarkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}