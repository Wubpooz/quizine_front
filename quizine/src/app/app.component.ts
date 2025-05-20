import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInviteComponent } from "./components/user-invite/user-invite.component";
import { WaitingPageComponent } from "./components/waiting-page/waiting-page.component";
import { QuizScoreComponent } from './components/quiz-score/quiz-score.component';
import { QuizRecapComponent } from './components/quiz-recap/quiz-recap.component';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInviteComponent, WaitingPageComponent, QuizQuestionComponent, QuizScoreComponent, QuizRecapComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'quizine';
}
