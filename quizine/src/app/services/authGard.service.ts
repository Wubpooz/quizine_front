// src/app/services/authGard.service.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router'; // <-- Import UrlTree
import { AppStore } from '../stores/app.store';
import { of } from 'rxjs';
import { catchError, filter, map, take, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = () => {
  const appStore = inject(AppStore);
  const router = inject(Router);
  const landingUrlTree: UrlTree = router.parseUrl('/landing');

  // if (environment.mockAuth) {
  //   return true;
  // }

  console.log("[authGard] Looking for user...");
  return appStore.currentUser.pipe(
    timeout(5000),
    filter(user => user !== undefined), // Wait for the state to be resolved from its initial value
    take(1),
    map((user) => {
      // If the user object exists, return true to allow access.
      // Otherwise, return the UrlTree to redirect to the landing page.
      return user ? true : landingUrlTree;
    }),
    catchError((err) => {
      // On timeout or any other error, redirect to landing
      return of(landingUrlTree);
    })
  );
};