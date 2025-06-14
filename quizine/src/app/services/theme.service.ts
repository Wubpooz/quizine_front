import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _isDarkMode = false;

  constructor() {
    const userTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._isDarkMode = userTheme === 'dark' || (!userTheme && systemPrefersDark);
    this.applyDarkMode();
  }

  get isDarkMode() {
    return this._isDarkMode;
  }

  toggleDarkMode() {
    this._isDarkMode = !this._isDarkMode;
    localStorage.setItem('theme', this._isDarkMode ? 'dark' : 'light');
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