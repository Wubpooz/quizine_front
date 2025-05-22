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
import { User } from './models/userModel';
import { APIService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInviteComponent, WaitingPageComponent, QuizQuestionComponent, QuizScoreComponent, QuizRecapComponent, LoginComponent,LandingComponent,HomePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'quizine';

  constructor(private appStore: AppStore, private apiService: APIService) {}

  ngOnInit(): void {
    //TODO init app

    //use cookie : connect.sid to know if I'm logged out and delete it when session ends

    if (localStorage.getItem('userId') === null) {
      localStorage.setItem('userId', "");
    } else {
      const userId = localStorage.getItem('userId');
      if (userId !== null) {
        this.apiService.getUserData(userId).subscribe((user: User) => {
          if (user !== null) {
            this.appStore.updateUser(user);
            localStorage.setItem('userId', userId);
          }
        });
      }
    }
  }
}
