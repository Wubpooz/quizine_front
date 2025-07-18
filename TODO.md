# Requirements
## Features
### P1
- [x] User notification handling (room joining)
- [x] Overflow sur score
- [x] Mobile friendliness (login, register, landing, waiting, navbar, sidebar, invite, tag-list, profile, description, library, home, explore, edit, create, notifications, score, recap, questions)
- [x] 404 page
- [x] Store sidebar toggle value between page refresh
- [x] Search bars alignement + search working again + scroll in dropdown
- [x] FIX HOMEPAGE
- [x] Fix checkmark on all recap
- [ ] Fix dark mode toggle on mobile
- [ ] Recheck mobile friendliness
- [ ] reject notifications
- [ ] disable quiz creation if not questions
- [ ] edit question time with slider 

### P2
- [x] Notifications when get call fails
- [x] Profile pop-up menu with dark mode toggle, logout
- [x] Dark mode (toggle + persist in localStorage + apply to all components + prefered color scheme), <https://m2.material.io/design/color/dark-theme.html#ui-application>
- [ ] Profile menu in navbar (<https://fr.freepik.com/vecteurs-premium/slider-jour-nuit_44129227.htm#from_element=cross_selling__vector> <https://fr.freepik.com/vecteurs-premium/bouton-vectoriel-interrupteur-bascule-mode-nuit-jour-luminosite-du-theme-application-element-option-diapositive-clair-sombre_28183375.htm>)
- [x] Fix create button (position, add checkmark and animation)
- [x] Add dark mode to components (_create_, _edit_, _explore_, _home_, _landing_, _library_, _cards_, _login_, _navbar_, _404_, _notifications_, _profile_, _description_, _question_, _recap_, _score_, _waiting_, _register_, _sidebar_, _tag-list_, _invite_)
- [ ] Add notifications where needed (<https://codeseven.github.io/toastr/demo.html>)
- [x] Toggle sidebar when clicking inside
- [ ] Add a loading spinner when waiting for API calls
- [ ] Profile/quiz pictures
- [ ] Quiz editing
- [ ] Quiz descriptions
- [ ] Friends
- [ ] Full screen pop-ups for call waits (<https://sweetalert2.github.io/>)

### P3
- [ ] UI Improvements
  - [ ] Make the style consistent between pages (follow the one from notifications maybe)
  - [ ] Tailwind components: <https://www.material-tailwind.com/blocks>, <https://flowbite.com/#components>, <https://merakiui.com/components>, <https://daisyui.com/resources/videos/fast-beautiful-uis-angular-daisyui-x5l6lsj6ekw/>, <https://tailwindflex.com/tag/navbar?is_responsive=true>, <https://windytoolbox.com/>, <https://mobbin.com/explore/web>, <https://demos.creative-tim.com/soft-ui-design-system/presentation.html>, <https://lbegey.fr/templates-tailwind.html>, <https://github.com/ionic-team/ionic-framework/tree/main/core/src/components>
  - [ ] Icons: <https://icons8.com/icons/set/health--style-material>, <https://ionic.io/ionicons>, <https://fonts.google.com/icons>, <https://phosphoricons.com/>, <https://isocons.app>, <https://heroicons.com/>, <https://iconscout.com/>, <https://remixicon.com/>, <https://iconboddy.com>
  - [ ] Colors: <https://www.iamsajid.com/ui-colors/>
  - [ ] Menu: Componetize, <https://tailwindcss.com/plus/ui-blocks/marketing/elements/flyout-menus>, <https://snipzy.dev/snippets/liquid-glass-nav.html>, <https://forum.bubble.io/t/creating-a-three-state-toggle-slider-switch-button/310817>
  - [ ] Tooltips (use group on related button and group-hover to show tooltip)
  - [ ] Improve 404 (<https://tailwindcss.com/plus/ui-blocks/marketing/feedback/404-pages>)
  - [ ] custom radio button component
- [ ] Animations (gsap, <https://animejs.com/documentation/stagger>)
- [ ] Add OAuth using Supabase
- [ ] Badge for notifications
- [ ] Search/sort by tags
- [ ] Rating system
- [ ] Quizz error reporting like duolingo
- [ ] Action when quiz-recap finish is triggered to go back to previous seen page
- [ ] Number of remaining player in waiting page

### P4
- [ ] Visit other user profiles
- [ ] Random quizz by theme



&nbsp;  
&nbsp;  
&nbsp;  
## Dev
### P1
- [ ] Release plan (<https://excalidraw.com/> ?)
- [ ] Vercel use deploy branch and not main, avoid deployments of not working stuff and unvalidated
- [ ] Create a migration to use Supabase locally
- [x] Github Pages deployment
- [x] Vercel + redis deployment, app works successfully fully
- [x] Wrap navbar + sidebar dans un composant
- [ ] fix issues if no selected quiz answer and all answer being green in quiz-recap
- [ ] Use only specific components (buttons, toggles, search bar, pop-up, menu, radio buttons, ...)
  - For instance use a title component like `<h1 class="text-2xl text-text-main dark:text-text-main">{{ quiz.nom }}</h1>`

### P2
- [x] Remove CSS files
- [x] Remove all nulls
- [ ] Use pipe(takeUntil(this.destroy$)) to avoid memory leaks on subscriptions
- [ ] Use only css variables for colors
- [ ] Order tailwind classes (luke display > position > ... > hover > focus)
- [ ] CI/CD Tests
- [ ] fix reload going to localhost:4200 instead of /home (when not logged in or logged in and on quizz-question for instance)
- [ ] fix how we indicate what's the correct option

### P3
- [ ] Use search API + search service
- [ ] API call to play quizz in waiting page ?
- [ ] Only use constructor for declaration, do everything in ngOnInit
- [ ] Home-card component (or just card component for that + library)

### P4
- [ ] Use SwPush for notifications on desktop and mobile
- [ ] Switch to supabase realtime for websockets
- [ ] ChatGPT integration
- [ ] ionic angular <https://github.com/ionic-team/ionic-framework/tree/main/core/src/components>
- [ ] PWA





-------------------

&nbsp;  
&nbsp;  
&nbsp;  
# Implementations
## Supabase Auth
### Data migration
```js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project.supabase.co',
  'YOUR_SERVICE_ROLE_KEY'
);

async function migrateUser(user) {
  const { data, error } = await supabase.auth.admin.createUser({
    email: user.email,
    password: user.password, // must be plaintext at migration time
    user_metadata: {
      // Store extra fields like picture in user_metadata, or sync them to a profiles table.
      picture: user.picture
    }
  });
  if (error) console.error('Migration failed:', error.message);
  else console.log('User migrated:', data.user.email);
}
```

### Store User metadata
```sql
create table profiles (
  id uuid primary key references auth.users(id),
  picture text,
  created_at timestamp default now()
);

create function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure handle_new_user();
```


### Front Auth
```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://your-project.supabase.co', 'public-anon-key');

// Google Sign-In
async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/callback' // optional
    }
  });
}


// Send OTP
await supabase.auth.signInWithOtp({ phone: '+1234567890' });

// Verify OTP
await supabase.auth.verifyOtp({ phone: '+1234567890', token: '123456' });
```


### Back Middleware
```js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-supabase-service-role-key'
);

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: error.message });

  req.user = user;
  next();
}
```



&nbsp;  
&nbsp;  
## Supabase Local Docker Version
1) dump data: `SELECT 'pg_dump command here' -- Placeholder only, use CLI method for full dump.`
2) Docker Setup:
```bash 
git clone https://github.com/supabase/supabase.git
cd supabase/docker
```
3) Import Schema and Data into Docker PostgreSQL:
```bash
docker cp supabase_dump.dump supabase-db:/tmp/

docker exec -it supabase-db bash
pg_restore -U postgres -d postgres /tmp/supabase_dump.dump
```
OR
```bash
docker cp supabase_dump.dump supabase-db:/tmp/

psql -U postgres -d postgres -f /tmp/schema.sql
psql -U postgres -d postgres -f /tmp/data.sql
```
4) Visit: <http://localhost:54323> for Supabase Studio.
5) Use `supabase init` and `supabase start` (if using CLI-managed local instance) or `docker compose up` (if using repo).

6) Optional: OAuth locally uses
```bash
GOTRUE_EXTERNAL_GOOGLE_ENABLED="true"
GOTRUE_EXTERNAL_GOOGLE_CLIENT_ID="your-google-client-id"
GOTRUE_EXTERNAL_GOOGLE_SECRET="your-google-secret"
GOTRUE_EXTERNAL_GOOGLE_REDIRECT_URI="http://localhost:8000/auth/v1/callback"
```



&nbsp;  
&nbsp;  
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
