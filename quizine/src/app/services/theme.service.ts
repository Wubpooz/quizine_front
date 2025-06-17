import { Injectable } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'themePreference';
  private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  private _pref: ThemePreference = 'system';

  constructor() {
    const saved = localStorage.getItem(this.STORAGE_KEY) as ThemePreference | null;
    this._pref = saved ?? 'system';

    this.applyTheme();

    this.mediaQuery.addEventListener('change', () => {
      if (this._pref === 'system') {
        this.applyTheme();
      }
    });
  }

  get preference(): ThemePreference {
    return this._pref;
  }

  setPreference(pref: ThemePreference) {
    this._pref = pref;
    localStorage.setItem(this.STORAGE_KEY, pref);
    this.applyTheme();
  }

  private applyTheme() {
    const html = document.documentElement;

    if (this._pref === 'light') {
      html.classList.remove('dark');
    }
    else if (this._pref === 'dark') {
      html.classList.add('dark');
    }
    else {
      const isDark = this.mediaQuery.matches;
      if (isDark) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }
}