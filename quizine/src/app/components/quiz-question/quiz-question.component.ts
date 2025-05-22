import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question, Option } from '../../models/quizModel';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'quiz-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.css'
})
export class QuizQuestionComponent {
  questionIndex: number = 0;
  totalQuestions: number = 0;
  quizName: string = '';
  question : Question;
  selectedAnswer: number | null = null;
  timer: number;
  private intervalId: any;

  constructor(public quizService: QuizService) {
    //TODO redo this
    this.question = this.quizService.getCurrentQuestion();
    this.questionIndex = this.quizService.getQuestionIndex();
    this.totalQuestions = this.quizService.getTotalQuestions();
    this.quizName = this.quizService.getTitle();
    this.timer = this.question.duration;
    this.startTimer();

    this.quizService.currentQuestionIndex$.subscribe(() => {
      this.question = this.quizService.getCurrentQuestion();
      this.questionIndex = this.quizService.getQuestionIndex();
      this.timer = this.question.duration;
      this.selectedAnswer = null;
      this.startTimer();
    });
  }

  private startTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    this.intervalId = setInterval(() => {
      if (this.timer > 0) {
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