import { Component, Input } from '@angular/core';
import { Quiz } from '../../models/quizModel';
import { TagListComponent } from '../tag-list/tag-list.component';
import { EditQuizQuestionComponent } from "./edit-quiz-question/edit-quiz-question.component";
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-edit-quiz',
  standalone: true,
  imports: [TagListComponent, EditQuizQuestionComponent, ButtonComponent],
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.css'
})
export class EditQuizComponent {
  @Input() quiz: Quiz = {
    id: 1,
    title: "Quiz de géographie",
    tags: ["histoire", "france", "europe"],
    nbQuestions: 2,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    createdBy: 'johndoe123',
    createdAt: '23/03/2025',
    private: false,
    questions: [
      {
        id: 1,
        quizId: 1,
        questionText: "Quelle est la capitale de la France ?",
        options: [
          { id: 1, questionId: 1, optionText: "Paris", isCorrect: true },
          { id: 2, questionId: 1, optionText: "Londres", isCorrect: false },
          { id: 3, questionId: 1, optionText: "Berlin", isCorrect: false },
          { id: 4, questionId: 1, optionText: "Madrid", isCorrect: false }
        ],
        correctAnswer: { id: 1, questionId: 1, optionText: "Paris", isCorrect: true },
        timer: 30
      },
      {
        id: 2,
        quizId: 1,
        questionText: "Quel est le plus grand océan du monde ?",
        options: [
          { id: 5, questionId: 2, optionText: "Atlantique", isCorrect: false },
          { id: 6, questionId: 2, optionText: "Indien", isCorrect: false },
          { id: 7, questionId: 2, optionText: "Arctique", isCorrect: false },
          { id: 8, questionId: 2, optionText: "Pacifique", isCorrect: true }
        ],
        correctAnswer: { id: 8, questionId: 2, optionText: "Pacifique", isCorrect: true },
        timer: 30
      }
    ]
  };
}
