import { Component } from '@angular/core';
import { QuizCardComponent } from '../quiz-card/quiz-card.component';
import { Quiz } from '../../models/quizModel';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [QuizCardComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent {
  quizList: Quiz[] = [
    {
      title: "Quiz d'histoire",
      tags: ["histoire", "france", "europe"],
      nbQuestions: 16,
      createdBy: "johndoe123",
      createdAt: "07/11/2023",
      link: '/quiz/1'
    },
    {
      title: "Quiz de géographie",
      tags: ["géographie", "france", "europe"],
      nbQuestions: 10,
      createdBy: "janesmith456",
      createdAt: "23/03/2025",
      link: '/quiz/2'
    },
    {
      title: "Quiz de mathématiques",
      tags: ["mathématiques", "france", "europe"],
      nbQuestions: 8,
      createdBy: "alicejohnson",
      createdAt: "22/03/2024",
      link: '/quiz/3'
    },
    {
      title: "Quiz de physique",
      tags: ["physique", "france", "europe"],
      nbQuestions: 12,
      createdBy: "bobbrown1998",
      createdAt: "13/07/2021",
      link: '/quiz/4'
    }
  ];
}
