import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from '../tag-list/tag-list.component';
import { Quiz } from '../../models/quizModel';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [TagListComponent, CommonModule],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.css'
})
export class QuizCardComponent {
  @Input() quiz!: Quiz;
}
