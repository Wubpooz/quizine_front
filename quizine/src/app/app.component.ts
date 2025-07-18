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
import { NotificationsService } from './services/notifications.service';
import { GameRequest } from './models/participationModel';

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
    private notifService: NotificationsService,
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



  pollNotifications() {
    setInterval(() => {
      // Skip polling if on quiz play route
      const blockRoutes = ['/404', '/quiz-question', '/quiz-recap', '/quiz-score', 'landing', 'login', 'register'];
      const currentUrl = this.router.url;

      if(blockRoutes.some(blocked => currentUrl.startsWith(blocked))) {
        return;
      }

      this.apiService.getNotifications().subscribe((gameRequests: GameRequest[]|undefined) => {
        let notifs: GameRequest[] = [];
        if(!gameRequests) {
          this.appStore.clearNotifications();
        } else {
          gameRequests.forEach((gameRequest) => {
            this.apiService.getUserFromId(gameRequest.id_requestor).subscribe((user) => {
              notifs.push({
                datetime: gameRequest.datetime,
                id_session: gameRequest.id_session,
                id_requestor: gameRequest.id_requestor,
                id_validator:gameRequest.id_validator,
                username: user?.username || "inconnu"
              })
            })
          })
        }

        const newNotifs = notifs.filter(n => !this.appStore['existingSessions'].has(n.id_session));
        if(newNotifs.length > 0) {
          this.appStore.addNewNotifications(newNotifs);
          for(const notif of newNotifs) {
            this.notifService.info(`Invitation de ${notif.username}.`);
          }
        }
      });
    }, 5000);
  }
}