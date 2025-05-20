import { Component, Input } from '@angular/core';
import { TagListComponent } from '../tag-list/tag-list.component';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [TagListComponent],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.css'
})
export class QuizCardComponent {
  @Input() title: string = '';
  @Input() tags: string[] = [];
  @Input() nbQuestions: number = 0;
  @Input() createdBy: string = '';
  @Input() createdAt: string = '';
  @Input() link: string = '';
}
