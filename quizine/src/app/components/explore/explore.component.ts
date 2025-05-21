import { Component } from '@angular/core';
import { QuizCardComponent } from '../quiz-card/quiz-card.component';
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [QuizCardComponent, CommonModule],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {
  quizList: Quiz[] = [
    {
      id: 1,
      title: "Quiz d'histoire",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["histoire", "france", "europe"],
      nbQuestions: 16,
      createdBy: "johndoe123",
      createdAt: "07/11/2023",
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
    },
    {
      id: 2,
      title: "Quiz de géographie",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["géographie", "france", "europe"],
      nbQuestions: 10,
      createdBy: "janesmith456",
      createdAt: "23/03/2025",
      private: false,
      questions: [
        {
          id: 3,
          quizId: 2,
          questionText: "Quel est le plus long fleuve du monde ?",
          options: [
            { id: 9, questionId: 3, optionText: "Nil", isCorrect: true },
            { id: 10, questionId: 3, optionText: "Amazonie", isCorrect: false },
            { id: 11, questionId: 3, optionText: "Yangtsé", isCorrect: false },
            { id: 12, questionId: 3, optionText: "Mississippi", isCorrect: false }
          ],
          correctAnswer: { id: 9, questionId: 3, optionText: "Nil", isCorrect: true },
          timer: 30
        }
      ]
    },
    {
      id: 3,
      title: "Quiz de mathématiques",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["mathématiques", "france", "europe"],
      nbQuestions: 8,
      createdBy: "alicejohnson",
      createdAt: "22/03/2024",
      private: false,
      questions: [
        {
          id: 4,
          quizId: 3,
          questionText: "Quelle est la racine carrée de 144 ?",
          options: [
            { id: 13, questionId: 4, optionText: "10", isCorrect: false },
            { id: 14, questionId: 4, optionText: "12", isCorrect: true },
            { id: 15, questionId: 4, optionText: "14", isCorrect: false },
            { id: 16, questionId: 4, optionText: "16", isCorrect: false }
          ],
          correctAnswer: { id: 14, questionId: 4, optionText: "12", isCorrect: true },
          timer: 30
        }
      ]
    },
    {
      id: 4,
      title: "Quiz de physique",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["physique", "france", "europe"],
      nbQuestions: 12,
      createdBy: "bobbrown1998",
      createdAt: "13/07/2021",
      private: false,
      questions: [
        {
          id: 5,
          quizId: 4,
          questionText: "Quelle est la vitesse de la lumière ?",
          options: [
            { id: 17, questionId: 5, optionText: "300 000 km/s", isCorrect: true },
            { id: 18, questionId: 5, optionText: "150 000 km/s", isCorrect: false },
            { id: 19, questionId: 5, optionText: "450 000 km/s", isCorrect: false },
            { id: 20, questionId: 5, optionText: "600 000 km/s", isCorrect: false }
          ],
          correctAnswer: { id: 17, questionId: 5, optionText: "300 000 km/s", isCorrect: true },
          timer: 30
        }
      ]
    }
  ];
}
