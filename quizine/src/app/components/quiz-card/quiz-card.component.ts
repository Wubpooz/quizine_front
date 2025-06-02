import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from '../tag-list/tag-list.component';
import { Quiz } from '../../models/quizModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [TagListComponent, CommonModule],
  templateUrl: './quiz-card.component.html'
})
export class QuizCardComponent {
  @Input() quiz!: Quiz;

  constructor(private router: Router) {}

  ngOnInit(){
  }
  goToQuizPreview(quizId: number) {
    this.router.navigate(['/quiz-preview', quizId]);
  }
}
