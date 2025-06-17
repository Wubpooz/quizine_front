import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../../button/button.component";
import { Quiz } from '../../../models/quizModel';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library-quiz-card',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  templateUrl: './library-quiz-card.component.html'
})
export class LibraryQuizCardComponent {
  @Input() quiz!: Quiz;

  constructor(private router: Router) {}
  
  goToQuizPreview(quizId: string) {
    this.router.navigate(['/quiz-preview', quizId]);
  }

  goToEditQuiz(quizId: string) {
    this.router.navigate(['/edit-quiz', quizId]);
  }
}
