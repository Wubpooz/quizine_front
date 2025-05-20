import { Component, Input } from '@angular/core';
import { ButtonComponent } from "../../button/button.component";

@Component({
  selector: 'app-library-quiz-card',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './library-quiz-card.component.html',
  styleUrl: './library-quiz-card.component.css'
})
export class LibraryQuizCardComponent {
  @Input() title: string = "";
  @Input() nbQuestions: number = 0;
  @Input() createdAt: string = "";
  @Input() visibility: string = "public"
}
