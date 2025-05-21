import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quiz, Question, Option } from '../models/quizModel';
import { gameSessionStore } from '../stores/gameSession.store';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quiz!: Quiz;
  private currentQuestionIndexSubject = new BehaviorSubject<number>(0);
  currentQuestionIndex$ = this.currentQuestionIndexSubject.asObservable();

  constructor(private gameSessionStore: gameSessionStore,
            private apiService: APIService
            ) {
    this.gameSessionStore.quiz.subscribe((quiz) => {
      this.quiz = quiz;
      this.currentQuestionIndexSubject.next(0);
    });
  }

  getName(): string {
    return this.quiz.name;
  }

  getCurrentQuestion(): Question {
    return this.quiz.questions[this.currentQuestionIndexSubject.value];
  }

  getQuestionIndex(): number {
    return this.currentQuestionIndexSubject.value;
  }

  getTotalQuestions(): number {
    return this.quiz.questions.length;
  }

  goToNextQuestion(): void {
    if (this.currentQuestionIndexSubject.value < this.quiz.questions.length - 1) {
      this.currentQuestionIndexSubject.next(this.currentQuestionIndexSubject.value + 1);
    }
  }

  goToPreviousQuestion(): void {
    if (this.currentQuestionIndexSubject.value > 0) {
      this.currentQuestionIndexSubject.next(this.currentQuestionIndexSubject.value - 1);
    }
  }

  selectAnswer(question: Question, answer: Option): void {
    this.gameSessionStore.answerList.getValue().set(question, answer);
  }
}