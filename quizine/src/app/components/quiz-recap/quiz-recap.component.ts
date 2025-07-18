import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz, Option } from '../../models/quizModel';
import { GameSessionStore } from '../../stores/gameSession.store';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { environment } from '../../../environments/environment';
import { MockData } from '../../services/mocks/mockData';

@Component({
  selector: 'quiz-recap',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './quiz-recap.component.html'
})
export class QuizRecapComponent {
  quiz!: Quiz;
  answers!: Map<string, Option>;

  constructor(private gameSessionStore: GameSessionStore,
      private appStore: AppStore,
      private router: Router
      ) {
    
    if(environment.mockAuth) {
      this.quiz = MockData.mockQuiz;
      this.gameSessionStore.answerList.next(new Map<string, Option>([
        ["1", this.quiz.questions[0].choices[0]],
        ["2", this.quiz.questions[1].choices[0]],
        ["3", this.quiz.questions[2].choices[0]],
        ["4", this.quiz.questions[3].choices[0]]
      ]));
    }

    this.gameSessionStore.quiz.subscribe((quiz: Quiz | undefined) => {
      if(quiz) {
        this.quiz = quiz;
      }
    });
    this.gameSessionStore.answerList.subscribe((answers: Map<string, Option>) => {
      if(answers) {
        this.answers = answers;
      }
    });
  }

  finish(): void {
    if(this.quiz.private || this.appStore.currentUser.value === undefined || this.quiz.createdBy !== this.appStore.currentUser.value.username) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/quiz-preview', this.quiz.id]);
    } 
  }
}
