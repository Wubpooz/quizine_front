import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AppStore } from '../stores/app.store';
import { of } from 'rxjs';
import { catchError, filter, map, take, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const appStore = inject(AppStore);
  const router = inject(Router);

  // If mockAuth is enabled, we allow access without checking the user
  if(environment.mockAuth) {
    return true;
  }

  console.log("[authGard] Looking for user...");
  // Wait until currentUser is not undefined (resolved)
  return appStore.currentUser.pipe(
    timeout(5000), // wait up to 5 seconds for user to be resolved
    filter(user => user !== undefined),
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        router.navigate(['/landing']);
        return false;
      }
    }),
    catchError(err => {
      // Timeout or other error occurred
      router.navigate(['/landing']);
      return of(false);
    })
  );
};