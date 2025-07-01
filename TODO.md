# Requirements
## Features
### P1
- [x] User notification handling (room joining)
- [x] overflow sur score
- [x] mobile friendliness (login, register, landing, waiting, navbar, sidebar, invite, tag-list, profile, description, library, home, explore, edit, create, notifications, score, recap, questions)
- [x] 404 page
- [x] store sidebar toggle value between page refresh
- [x] search bars alignement + search working again + scroll in dropdown

### P2
- [x] notif when get call fails
- [x] profile pop-up menu with dark mode toggle, logout
- [x] dark mode (toggle + persist in localStorage + apply to all components + prefered color scheme)
- [ ] Profile menu in navbar (<https://fr.freepik.com/vecteurs-premium/slider-jour-nuit_44129227.htm#from_element=cross_selling__vector> <https://fr.freepik.com/vecteurs-premium/bouton-vectoriel-interrupteur-bascule-mode-nuit-jour-luminosite-du-theme-application-element-option-diapositive-clair-sombre_28183375.htm>)
- [ ] fix create button (position, add checkmark and animation)
- [ ] add dark mode to components
- [ ] add notifications where needed (<https://codeseven.github.io/toastr/demo.html>)
- [x] toggle sidebar when clicking inside
- [ ] add a loading spinner when waiting for API calls
- [ ] profile/quiz pictures
- [ ] quiz editing
- [ ] quiz descriptions
- [ ] use <https://sweetalert2.github.io/> for full screen and very customizable pop-ups
- [ ] friends
- [ ] animations (gsap, <https://animejs.com/documentation/stagger>)

### P3
- [ ] Improve 404 (<https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages>)
- [ ] Improve flyout menu (put in component, <https://snipzy.dev/snippets/liquid-glass-nav.html>, <https://forum.bubble.io/t/creating-a-three-state-toggle-slider-switch-button/310817>, <https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus>)
- [ ] add OAuth Google
- [ ] badge for notifs
- [ ] Search/sort by tags
- [ ] Rating system
- [ ] quizz error reporting like duolingo
- [ ] action when quiz-recap finish is triggered to go back to previous seen page
- [ ] Number of remaining player in waiting page

### P4
- [ ] visit other user profiles
- [ ] random quizz by theme



&nbsp;  
&nbsp;  
&nbsp;  
## Dev
### P1
- [ ] Release plan
- [ ] Vercel use deploy branch and not main, avoid deployments of not working stuff and unvalidated
- [x] Github Pages deployment
- [x] Vercel + redis deployment, app works successfully fully
- [x] wrap navbar + sidebar dans un composant
- [ ] use only specific components (buttons, toggles...)

### P2
- [x] remove CSS files
- [ ] remove all nulls
- [ ] search bar + pop-up component(s)
- [ ] use only css variables for colors
- [ ] CI/CD Tests

### P3
- [ ] use search API
- [ ] API call to play quizz in waiting page ?
- [ ] only use constructor for declaration, do everything in ngOnInit
- [ ] home-card component (or just card component for that + library)

### P4
- [ ] use SwPush for notifications on desktop and mobile


- [x] probes
- [x] keep alive redis
- [ ] switch to supabase realtime for websockets
- [ ] tests in CI/CD
- [ ] ChatGPT integration





-------------------

&nbsp;  
&nbsp;  
&nbsp;  
# Implementations
## Tests in CI/CD

Security flaws linter : `npm install eslint-plugin-security --save-dev`  

.eslintrc : 
```json
{
  "plugins": ["security"],
  "extends": ["plugin:security/recommended"]
}
```

### Tools comparisons
| Test                          | Tool               | Easy to add? | Where    |
| ----------------------------- | ------------------ | ------------ | -------- |
| Vulnerability scan            | `npm audit` / Snyk | Easy         | CI       |
| Lint for security             | ESLint plugin      | Easy         | CI       |
| Static tests for auth & input | Jest/Karma         | Easy         | Codebase |
| Dynamic scan                  | ZAP                | Hard         | Staging  |


&nbsp;  
### CI/CD pipeline
/.github/workflows/ci.yml :
```yml
name: Frontend CI/CD

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  test-and-scan:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      # Install & Test
      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test -- --watch=false --browsers=ChromeHeadless

      # Security: Dependency Audit
      - name: Audit dependencies
        run: npm audit --audit-level=high

      # Security: ESLint (with plugin:security)
      - name: Lint for security
        run: npm run lint

  deploy:
    needs: test-and-scan
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Confirm Vercel auto-deploy
        run: echo "Vercel will pick up the push and deploy automatically."
```


AND  


```yml
name: Backend CI/CD

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]

jobs:
  test-and-scan:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      # Install & Test
      - name: Install dependencies
        run: npm ci

      - name: Compile TypeScript
        run: npm run build

      - name: Run unit tests
        run: npm run test

      # Security: Dependency Audit
      - name: Audit dependencies
        run: npm audit --audit-level=high

      # Security: ESLint (with plugin:security)
      - name: Lint for security
        run: npm run lint

      # Optional: Dynamic Scan in Staging
      - name: OWASP ZAP Baseline Scan
        if: github.event_name == 'push' && github.ref == 'refs/heads/main'
        uses: zaproxy/action-baseline@v0.10.0
        with:
          target: ${{ secrets.STAGING_URL }}

  deploy:
    needs: test-and-scan
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Confirm Vercel auto-deploy
        run: echo "Vercel backend deployment has been triggered."
```

&nbsp;  
#### Add Karma/Jasmine front and Jest/Mocha back tests



------


&nbsp;  
&nbsp;  
## AuthGard & AutoLogin
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isAuthenticated();
    if (!isLoggedIn) {
      this.router.navigate(['/404']);
      return false;
    }
    return true;
  }
}
```

```typescript
const routes: Routes = [
  { path: '404', component: NotFoundComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/404' }
];
```

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');
  }
  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/me'); // Backend must use the session from the cookie
  }
}
```

### Auto-login
Using the cookie :  
1. On app startup, call an API like `/api/me` to check if the user is still authenticated (based on cookie).
2. If the session is valid, set the user in the store (`currentUser`).
3. If the session is invalid, route to login or show a public view.
4. This replaces the need for `localStorage`-based login persistence.

In `app.component.ts`:
```ts
constructor(private authService: AuthService, private router: Router) {}

ngOnInit() {
  this.authService.getCurrentUser().subscribe({
    next: (user) => {
      this.user = user;
    },
    error: () => {
      this.router.navigate(['/login']);
    }
  });
}
```

```ts
canActivate(): boolean {
  return !!this.appStore.currentUser;
}
```
