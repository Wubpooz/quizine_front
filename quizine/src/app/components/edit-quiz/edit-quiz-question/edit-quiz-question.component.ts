import { Component, Input } from '@angular/core';
import { Question } from '../../../models/quizModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'edit-quiz-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-quiz-question.component.html'
})
export class EditQuizQuestionComponent {
  @Input() question!: Question;
  @Input() index!: number;
}
