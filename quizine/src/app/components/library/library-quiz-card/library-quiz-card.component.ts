import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../../button/button.component";
import { Quiz } from '../../../models/quizModel';

@Component({
  selector: 'app-library-quiz-card',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './library-quiz-card.component.html',
  styleUrl: './library-quiz-card.component.css'
})
export class LibraryQuizCardComponent {
  @Input() quiz!: Quiz;
}
