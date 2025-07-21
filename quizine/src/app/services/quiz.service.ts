import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Quiz, Question, Option } from '../models/quizModel';
import { GameSessionStore } from '../stores/gameSession.store';
import { APIService } from './api.service';
import { Router } from '@angular/router';
import { AppStore } from '../stores/app.store';
import { SpinnerService } from './spinner.service';
import { NotificationsService } from './notifications.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private destroy$ = new Subject<void>();
  private scorePerAnswer: number = 100;
  private quiz: Quiz | null = null;
  private currentQuestionIndexSubject = new BehaviorSubject<number>(0);
  currentQuestionIndex$ = this.currentQuestionIndexSubject.asObservable();

  constructor(
    private gameSessionStore: GameSessionStore,
    private appStore: AppStore,
    private apiService: APIService,
    private router: Router,
    private notifService: NotificationsService,
    private spinnerService: SpinnerService) {
    this.gameSessionStore.quiz.subscribe((quiz: Quiz|undefined) => {
      if(!quiz) return;
      this.quiz = quiz;
      this.currentQuestionIndexSubject.next(0);
    });
  }

  getTitle(): string {
    if(!this.quiz) return '';
    return this.quiz.nom;
  }

  getCurrentQuestion(): Question {
    if(!this.quiz) {
      throw new Error('Quiz not loaded');
    }
    return this.quiz.questions[this.currentQuestionIndexSubject.value];
  }

  getQuestionIndex(): number {
    return this.currentQuestionIndexSubject.value;
  }

  getTotalQuestions(): number {
    return this.quiz?.questions.length ?? 0;
  }

  goToNextQuestion(): void {
    if(!this.quiz) return;

    const currentIndex = this.currentQuestionIndexSubject.value;
    const totalQuestions = this.quiz.questions.length;

    if(currentIndex < totalQuestions - 1) {
      this.currentQuestionIndexSubject.next(currentIndex + 1);
    } else if(currentIndex === totalQuestions - 1) {
      const user = this.appStore.currentUser.value;
      if(!user) return;

      const finalScore = this.calculateScore();
      this.gameSessionStore.updateScore(user, finalScore);
      this.router.navigate(['/quiz-score']);
    }
  }

  goToPreviousQuestion(): void {
    const currentIndex = this.currentQuestionIndexSubject.value;
    if(currentIndex > 0) {
      this.currentQuestionIndexSubject.next(currentIndex - 1);
    }
  }

    selectAnswer(questionId: string, answer: Option|null): void {
      if(!this.quiz) return;
      if(!questionId || typeof questionId !== 'string') return;
      const answerMap = this.gameSessionStore.answerList.getValue();
      answerMap.set(questionId, answer);
      this.gameSessionStore.answerList.next(answerMap);
  }

  async getQuizById(quizId: string): Promise<Quiz> {
    if(!quizId) {
      this.notifService.error('No quizId provided');
      throw new Error('No quizId provided');
    }
    try {
      this.spinnerService.show('Chargement du quiz…');
      const quiz = await firstValueFrom(this.apiService.getQuiz(quizId).pipe(takeUntil(this.destroy$)));
      if(!quiz) {
        this.notifService.error('Quiz not found');
        throw new Error('Quiz not found');
      }
      this.quiz = quiz;
      return quiz;
    } catch (error) {
      this.notifService.error('Failed to fetch quiz');
      console.error('Failed to fetch quiz:', error);
      throw error;
    } finally {
      this.spinnerService.hide();
    }
  }

  calculateScore(): number {
    let score = 0;
    const answerList = this.gameSessionStore.answerList.getValue();
    const quiz = this.quiz ?? this.gameSessionStore.quiz.getValue();

    if(!quiz) {
      console.debug('No quiz loaded.');
      return 0;
    }

    quiz.questions.forEach((question) => {
      const userAnswer = answerList.get(question.id);
      if(!userAnswer) return;
      if(userAnswer?.id === question.id_answer) {
        score += this.scorePerAnswer;
      }
    });

    return score;
  }
}