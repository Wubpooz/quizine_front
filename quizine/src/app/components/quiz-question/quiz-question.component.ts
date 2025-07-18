import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question, Option } from '../../models/quizModel';
import { QuizService } from '../../services/quiz.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'quiz-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-question.component.html'
})
export class QuizQuestionComponent {
  private destroy$ = new Subject<void>();
  questionIndex: number = 0;
  totalQuestions: number = 0;
  quizName: string = '';
  question!: Question;
  selectedAnswer: string | null = null;
  timer!: number;
  private intervalId: any;

  constructor(private quizService: QuizService) {}
  
  ngOnInit() {
    this.quizName = this.quizService.getTitle();
    this.totalQuestions = this.quizService.getTotalQuestions();
    this.question = this.quizService.getCurrentQuestion();
    this.questionIndex = this.quizService.getQuestionIndex();
    this.timer = this.question?.duration;
    this.startTimer();
  
    this.quizService.currentQuestionIndex$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.question = this.quizService.getCurrentQuestion();
      this.questionIndex = this.quizService.getQuestionIndex();
      this.timer = this.question?.duration;
      this.selectedAnswer = null;
      this.startTimer();
    });
  }

  ngOnDestroy() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTimer() {
    if(this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      if(this.timer > 0) {
        this.timer--;
      } else {
        clearInterval(this.intervalId);
        this.quizService.goToNextQuestion();
        this.selectedAnswer = null;
      }
    }, 1000);
  }

  selectAnswer(answer: Option) {
    this.selectedAnswer = answer.id;
    this.quizService.selectAnswer(this.question.id, answer);
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}