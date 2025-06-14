import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet } from '@angular/router';
import { UserInviteComponent } from "./components/user-invite/user-invite.component";
import { LoginComponent } from "./components/login/login.component";
import { LandingComponent } from "./components/landing/landing.component";
import { HomePageComponent } from "./components/home-page/home-page.component";
import { WaitingPageComponent } from "./components/waiting-page/waiting-page.component";
import { QuizScoreComponent } from './components/quiz-score/quiz-score.component';
import { QuizRecapComponent } from './components/quiz-recap/quiz-recap.component';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';
import { AppStore } from './stores/app.store';
import { APIService } from './services/api.service';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInviteComponent, WaitingPageComponent, QuizQuestionComponent, QuizScoreComponent, QuizRecapComponent, LoginComponent,LandingComponent,HomePageComponent,NotificationsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Quizine';
  isDarkMode: boolean = false;

  constructor(
    private appStore: AppStore,
    private apiService: APIService,
    private router: Router,
    public theme: ThemeService,
    @Inject(DOCUMENT) private document: Document
  ) {}


ngOnInit(): void {
  this.appStore.init();

  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd)
  ).subscribe(() => {
    this.apiService.getUserData().subscribe({
      next: (user) => {
        this.appStore.updateUser(user);
        const publicRoutes = ['/landing', '/login', '/register', '/'];
        if (user) {
          if (publicRoutes.includes(this.router.url)) {
            this.router.navigate(['/home']);
          }
        } else {
          if (!publicRoutes.includes(this.router.url)) {
            this.router.navigate(['/landing']);
          }
        }
      },
      error: () => {
        const publicRoutes = ['/landing', '/login', '/register', '/'];
        if (!publicRoutes.includes(this.router.url)) {
          this.router.navigate(['/landing']);
        }
      }
    });
  });
}

  // Uncomment the following code if you want to use cookies for session management, requires httpOnly: false cookies to be set by the backend.
  // ngOnInit(): void {
  //   const connectSid = this.getCookie('connect.sid');
  //   this.appStore.init();

  //   if(connectSid) {
  //     this.apiService.getUserData().subscribe({
  //       next: (user) => {
  //         if (user) {
  //           console.log("User retrieved from cookie:", user);
  //           this.appStore.updateUser(user);
  //           this.router.navigate(['/home']);
  //         } else {
  //           console.log("Session expired, clear cookie and user data.");
  //           this.deleteCookie('connect.sid');
  //           this.appStore.updateUser(undefined as any);
  //           this.router.navigate(['/landing']);
  //         }
  //       },
  //       error: (err) => {

  //         this.router.navigate(['/landing']);
  //       }
  //     });
  //   } else {
  //     console.log("No cookie found, user not logged in.");
  //     this.router.navigate(['/landing']);
  //   }
  // }

  // getCookie(name: string): string | null {
  //   const match = this.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  //   return match ? match[2] : null;
  // }

  // deleteCookie(name: string) {
  //   this.document.cookie = `${name}=; Max-Age=0; path=/;`;
  // }
}