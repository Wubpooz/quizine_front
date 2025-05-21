import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagListComponent } from '../tag-list/tag-list.component';

@Component({
  selector: 'app-quiz-card',
  standalone: true,
  imports: [TagListComponent, CommonModule],
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.css'
})
export class QuizCardComponent {
  @Input() title: string = "";
  @Input() tags: string[] = [];
  @Input() nbQuestions: number = 0;
  @Input() createdBy: string = "";
  @Input() createdAt: Date = new Date();
  @Input() link: string = "";
}
