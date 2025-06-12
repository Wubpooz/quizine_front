import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../stores/app.store';
import { map, filter, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const appStore = inject(AppStore);
  const router = inject(Router);

  // Wait until currentUser is not undefined (resolved)
  return appStore.currentUser.pipe(
    filter(user => user !== undefined), // Wait until user is resolved (either logged in or not)
    take(1),
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