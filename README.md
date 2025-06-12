# Quizine

## Lien Figma (Maquettes)
[Cliquez ici.](https://www.figma.com/design/aIMeyjUQSQoAYLZoIbqEE4/Quiz-app?node-id=0-1&t=oOwVkBpXpddyvPUO-1)

## TODO
### P1
- [x] User notification handling (room joining)
- [x] overflow sur score
- [x] mobile friendliness (login, register, landing, waiting, navbar, sidebar, invite, tag-list, profile, description, library, home, explore, edit, create, notifications, score, recap, questions)
- [x] 404 page
- [x] wrap navbar + sidebar dans un composant
- [x] store sidebar toggle value between page refresh
- [x] search bars alignement + search working again + scroll in dropdown
- [x] remove CSS files
- [x] Github Pages deployment
- [x] Vercel + redis deployment, app works successfully fully

### P2
- [ ] profile/quiz pictures
- [ ] handle friends correctly
- [ ] add a loading spinner when waiting for API calls
- [ ] quiz descriptions
- [ ] quiz editing ?
- [ ] Rating system
- [ ] use search API
- [ ] route to 404 or notif when get call fails

### P3
- [ ] Search/sort by tags
- [ ] search bar + pop-up component(s)

### P4
- [ ] visit other user profiles
- [ ] home-card component (or just card component for that + library)




# Avoid user opening pages from url without being logged in
ng generate guard auth

auth.guard.ts :
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isAuthenticated(); // implement this
    if (!isLoggedIn) {
      this.router.navigate(['/404']); // redirect to 404
      return false;
    }
    return true;
  }
}
```

ng generate component not-found

app-routing.module.ts :
```typescript
const routes: Routes = [
  { path: '404', component: NotFoundComponent },
  // your protected routes
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // wildcard route for undefined paths
  { path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```


auth.service.ts :
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user'); // or sessionStorage, or cookie-based session check
  }
}
```



# Auto-login
To **allow auto-login** in your Angular app (especially when using cookie-based sessions like `connect.sid`), you need to:

---

## ✅ Overview of Auto-Login Workflow

1. On app startup, call an API like `/api/me` to check if the user is still authenticated (based on cookie).
2. If the session is valid, set the user in the store (`currentUser`).
3. If the session is invalid, route to login or show a public view.
4. This replaces the need for `localStorage`-based login persistence.

---

## ✅ Step-by-Step Setup

---

### 1. **Expose a `/me` endpoint in the backend**

Ensure your backend supports a route like:

```http
GET /api/me
```

It should return the current user if the session (`connect.sid` cookie) is valid, or a 401 otherwise.

---

### 2. **Create an `AuthService` method to check session**

```ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/me'); // Backend must use the session from the cookie
  }
}
```

---

### 3. **Initialize on App Load**

In `app.component.ts` or a global store service (e.g. `AppStore`):

```ts
constructor(private authService: AuthService, private router: Router) {}

ngOnInit() {
  this.authService.getCurrentUser().subscribe({
    next: (user) => {
      // Store user globally (e.g., in a service or store)
      this.user = user;
    },
    error: () => {
      // No valid session
      this.router.navigate(['/login']); // or allow guest
    }
  });
}
```

If you're using a global store like `app.store.ts`, you can move this logic there.

---

### 4. **Use Guard Based on This State**

In your `AuthGuard`:

```ts
canActivate(): boolean {
  return !!this.appStore.currentUser; // or another boolean flag
}
```

Make sure this only triggers **after** the session check has completed.

---

## ✅ Optional Enhancements

* Store a `sessionChecked` flag to prevent premature redirects.
* Allow unauthenticated access to public routes while protecting others.
* Show a loading screen while verifying the session on first load.

---

## ✅ Summary

| Task                 | Tool                                                          |
| -------------------- | ------------------------------------------------------------- |
| Persist login        | Cookie-based session                                          |
| Auto-login on reload | Call `/api/me` in `ngOnInit()`                                |
| Protect routes       | `AuthGuard` using session state                               |
| Store user globally  | Use a service or state management (e.g., NgRx, Signals, etc.) |

Let me know if you want code for Signals or NgRx version!
