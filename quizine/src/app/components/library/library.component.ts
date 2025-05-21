import { Component } from '@angular/core';
import { Quiz } from '../../models/quizModel';
import { LibraryQuizCardComponent } from "./library-quiz-card/library-quiz-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryQuizCardComponent, CommonModule],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {
  quizList: Quiz[] = [
    {
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
    },
    {
      id: 2,
      title: "Quiz de géographie",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["géographie", "france", "europe"],
      createdBy: "janesmith456",
      createdAt: new Date("2025-03-23"),
      private: false,
      questions: [
        {
          id: 3,
          quizId: 2,
          questionText: "Quel est le plus long fleuve du monde ?",
          options: [
            { id: 9, optionText: "Nil"},
            { id: 10, optionText: "Amazonie"},
            { id: 11, optionText: "Yangtsé"},
            { id: 12, optionText: "Mississippi"}
          ],
          correctAnswer: { id: 9, optionText: "Nil"},
          timer: 30
        }
      ]
    },
    {
      id: 3,
      title: "Quiz de mathématiques",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["mathématiques", "france", "europe"],
      createdBy: "alicejohnson",
      createdAt: new Date("2024-03-22"),
      private: false,
      questions: [
        {
          id: 4,
          quizId: 3,
          questionText: "Quelle est la racine carrée de 144 ?",
          options: [
            { id: 13, optionText: "10"},
            { id: 14, optionText: "12"},
            { id: 15, optionText: "14"},
            { id: 16, optionText: "16"}
          ],
          correctAnswer: { id: 14, optionText: "12"},
          timer: 30
        }
      ]
    },
    {
      id: 4,
      title: "Quiz de physique",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      tags: ["physique", "france", "europe"],
      createdBy: "bobbrown1998",
      createdAt: new Date("2021-07-13"),
      private: false,
      questions: [
        {
          id: 5,
          quizId: 4,
          questionText: "Quelle est la vitesse de la lumière ?",
          options: [
            { id: 17, optionText: "300 000 km/s"},
            { id: 18, optionText: "150 000 km/s"},
            { id: 19, optionText: "450 000 km/s"},
            { id: 20, optionText: "600 000 km/s"}
          ],
          correctAnswer: { id: 17, optionText: "300 000 km/s"},
          timer: 30
        }
      ]
    }
  ];
}
