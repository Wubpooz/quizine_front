import { Component, Input } from '@angular/core';
import { TagListComponent } from "../tag-list/tag-list.component";
import { ButtonComponent } from "../button/button.component";
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-description',
  standalone: true,
  imports: [TagListComponent, ButtonComponent, CommonModule],
  templateUrl: './quiz-description.component.html',
  styleUrl: './quiz-description.component.css'
})
export class QuizDescriptionComponent {
    @Input() quiz: Quiz = {
      id: 1,
      title: "Quiz d'histoire",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["histoire", "france", "europe"],
      createdBy: "johndoe123",
      createdAt: new Date("2023-11-07"),
      private: false,
      questions: [
        {
          id: 1,
          quizId: 1,
          questionText: "Quelle est la capitale de la France ?",
          options: [
            { id: 1, optionText: "Paris"},
            { id: 2, optionText: "Londres"},
            { id: 3, optionText: "Berlin"},
            { id: 4, optionText: "Madrid"}
          ],
          correctAnswer: { id: 1, optionText: "Paris"},
          timer: 30
        },
        {
          id: 2,
          quizId: 1,
          questionText: "Quel est le plus grand océan du monde ?",
          options: [
            { id: 5, optionText: "Atlantique"},
            { id: 6, optionText: "Indien"},
            { id: 7, optionText: "Arctique"},
            { id: 8, optionText: "Pacifique"}
          ],
          correctAnswer: { id: 8, optionText: "Pacifique"},
          timer: 30
        }
      ]
    };
}
