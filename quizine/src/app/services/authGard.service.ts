import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../stores/app.store';
import { map, filter, take } from 'rxjs';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const appStore = inject(AppStore);
  const router = inject(Router);

  // If mockAuth is enabled, we allow access without checking the user
  if(environment.mockAuth) {
    return true;
  }

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