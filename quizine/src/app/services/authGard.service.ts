import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AppStore } from '../stores/app.store';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const appStore = inject(AppStore);
  const router = inject(Router);

  return appStore.currentUser.pipe(
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/landing']);
        return false;
      }
    })
  );
};