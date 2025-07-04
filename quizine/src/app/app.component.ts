import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { finalize } from 'rxjs';
import { injectSpeedInsights } from '@vercel/speed-insights';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, UserInviteComponent, WaitingPageComponent, QuizQuestionComponent, QuizScoreComponent, QuizRecapComponent, LoginComponent,LandingComponent,HomePageComponent,NotificationsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Quizine';
  isDarkMode: boolean = false;
  isLoading: boolean = true;
  
  constructor(
    private appStore: AppStore,
    private apiService: APIService,
    private router: Router,
    public theme: ThemeService,
    @Inject(DOCUMENT) private document: Document
  ) {}


  ngOnInit(): void {
    injectSpeedInsights();
    this.appStore.init();
    const publicRoutes = ['/landing', '/login', '/register'];

    this.apiService.getUserData().pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (user) => {
        this.appStore.updateUser(user);
        // If a logged-in user lands on a public page, send them to home.
        if (user && publicRoutes.includes(this.router.url)) {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.appStore.removeUser();
        // If the API call fails (unauthenticated) AND the user is NOT on a public route...
        if (!publicRoutes.includes(this.router.url)) {
          this.router.navigate(['/landing']);
        }
      }
    });
  }
}