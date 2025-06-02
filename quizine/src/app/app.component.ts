import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInviteComponent, WaitingPageComponent, QuizQuestionComponent, QuizScoreComponent, QuizRecapComponent, LoginComponent,LandingComponent,HomePageComponent,NotificationsComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Quizine';

  constructor(
    private appStore: AppStore,
    private apiService: APIService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // Check if connect.sid cookie exists
    const connectSid = this.getCookie('connect.sid');
    this.appStore.init();
    // if (!connectSid) {
    //   this.appStore.updateUser(undefined as any);
    //   localStorage.removeItem('userId');
    //   console.log("Not logged in, clear user data.");
    // } else {
    //   console.log("Cookie exists, try to restore user.");
    //   const userId = localStorage.getItem('userId');
    //   if (userId) {
    //     this.apiService.getUserData().subscribe((user: User) => {
    //       if (user) {
    //         console.log("User retrieved.");
    //         this.appStore.updateUser(user);
    //         localStorage.setItem('userId', userId);
    //       } else {
    //         console.log("Session expired, clear cookie and user data.")
    //         this.deleteCookie('connect.sid');
    //         this.appStore.updateUser(undefined as any);
    //         localStorage.removeItem('userId');
    //       }
    //     });
    //   }
    // }
  }

  getCookie(name: string): string | null {
    const match = this.document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  deleteCookie(name: string) {
    this.document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
}