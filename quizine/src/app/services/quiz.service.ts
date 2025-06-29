import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Quiz, Question, Option } from '../models/quizModel';
import { GameSessionStore } from '../stores/gameSession.store';
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

  constructor(private gameSessionStore: GameSessionStore,
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
      const user = this.appStore.currentUser.value;
      if (!user) return;
    
      const finalScore = this.gameSessionStore.calculateScore();
      this.gameSessionStore.updateScore(user, finalScore);
      this.router.navigate(['/quiz-score']);
    }
  }

  goToPreviousQuestion(): void {
    if (this.currentQuestionIndexSubject.value > 0) {
      this.currentQuestionIndexSubject.next(this.currentQuestionIndexSubject.value - 1);
    }
  }

  selectAnswer(questionId: string, answer: Option): void {
    this.gameSessionStore.answerList.getValue().set(questionId, answer);
  }

  getQuizById(quizId: string): Promise<Quiz> {
    return this.apiService.getQuiz(quizId).toPromise().then((quiz) => {
      if (!quiz) {
        throw new Error('Quiz not found');
      }
      return quiz;
    });
  }

  calculateScore(): number {
    let score = 0;
    const answerList = this.gameSessionStore.answerList.getValue();
    const quiz = this.gameSessionStore.quiz.getValue();

    if (!quiz) {
      console.debug("No quiz.");
      return score;
    }

    quiz.questions.forEach((question) => {
      const userAnswer = answerList.get(question.id);
      if (userAnswer && userAnswer.id === question.id_answer) {
        score++;
      }
    });

    return score;
  }
}