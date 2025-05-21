import { Component, Input } from '@angular/core';
import { Question } from '../../../models/quizModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-quiz-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-quiz-question.component.html',
  styleUrl: './edit-quiz-question.component.css'
})
export class EditQuizQuestionComponent {
  @Input() question!: Question;
  @Input() index!: number;
}
