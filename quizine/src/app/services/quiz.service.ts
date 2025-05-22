import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quiz, Question, Option } from '../models/quizModel';
import { gameSessionStore } from '../stores/gameSession.store';
import { APIService } from './api.service';
import { Router } from '@angular/router';
import { AppStore } from '../stores/app.store';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quiz!: Quiz;
  private currentQuestionIndexSubject = new BehaviorSubject<number>(0);
  currentQuestionIndex$ = this.currentQuestionIndexSubject.asObservable();

  constructor(private gameSessionStore: gameSessionStore,
            private appStore: AppStore,
            private apiService: APIService,
            private router: Router
            ) {
    this.gameSessionStore.quiz.subscribe((quiz) => {
      if(quiz === undefined){
        return
      }
      this.quiz = quiz;
      this.currentQuestionIndexSubject.next(0);
    });
  }
//TODO calcul du score
  getTitle(): string {
    return this.quiz.nom;
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
    } else if (this.currentQuestionIndexSubject.value === this.quiz.questions.length - 1) {
      if(this.appStore.currentUser.value === undefined){
        return
      }
      this.gameSessionStore.updateScore(this.appStore.currentUser.value, this.gameSessionStore.score); //TODO
      this.gameSessionStore.updateQuiz(this.quiz.id);
      this.router.navigate(['/quiz-score']);
    }
  }

  goToPreviousQuestion(): void {
    if (this.currentQuestionIndexSubject.value > 0) {
      this.currentQuestionIndexSubject.next(this.currentQuestionIndexSubject.value - 1);
    }
  }

  selectAnswer(questionId: number, answer: Option): void {
    this.gameSessionStore.answerList.getValue().set(questionId, answer);
  }

  getQuizById(quizId: number): Promise<Quiz> {
    return this.apiService.getQuizById(quizId).toPromise().then((quiz) => {
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return quiz;
    });
  }
}