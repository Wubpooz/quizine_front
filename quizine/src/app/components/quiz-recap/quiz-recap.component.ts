import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Quiz, Option } from '../../models/quizModel';
import { gameSessionStore } from '../../stores/gameSession.store';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';

@Component({
  selector: 'quiz-recap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-recap.component.html',
  styleUrl: './quiz-recap.component.css'
})
export class QuizRecapComponent {
  quiz!: Quiz;
  answers!: Map<number, Option>;

  constructor(private gameSessionStore: gameSessionStore,
      private appStore: AppStore,
      private router: Router
      ) {
    this.gameSessionStore.quiz.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
    this.gameSessionStore.answerList.subscribe((answers: Map<number, Option>) => {
      this.answers = answers;
    });
  }

  finish(): void {
    if(this.quiz.private || this.quiz.createdBy !== this.appStore.currentUser.value.name) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/quiz-preview', this.quiz.id]);
    }
    //TODO ?
  }
}
