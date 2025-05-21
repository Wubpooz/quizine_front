import { Component, Input } from '@angular/core';
import { TagListComponent } from "../tag-list/tag-list.component";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-quiz-description',
  standalone: true,
  imports: [TagListComponent, ButtonComponent],
  templateUrl: './quiz-description.component.html',
  styleUrl: './quiz-description.component.css'
})
export class QuizDescriptionComponent {
    @Input() title: string = "Quiz d'histoire";
    @Input() tags: string[] = ["histoire", "france", "europe"];
    @Input() nbQuestions: number = 16;
    @Input() description: string = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    @Input() createdBy: string = 'johndoe123';
    @Input() createdAt: string = '23/03/2025';
}
