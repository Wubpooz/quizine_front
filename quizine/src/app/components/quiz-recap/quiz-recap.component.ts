import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question, Quiz, Option } from '../../models/quizModel';
import { gameSessionStore } from '../../stores/gameSession.store';

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

  constructor(private gameSessionStore: gameSessionStore) {
    this.gameSessionStore.quiz.subscribe((quiz: Quiz) => {
      this.quiz = quiz;
    });
    this.gameSessionStore.answerList.subscribe((answers: Map<number, Option>) => {
      this.answers = answers;
    });
  }

  next(): void {
    //TODO goto quiz si createur du quiz, to home sinon
  }
}
