import { Component } from '@angular/core';
import { TagListComponent } from "../tag-list/tag-list.component";
import { ButtonComponent } from "../button/button.component";
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { UserInviteComponent } from "../user-invite/user-invite.component";
import { WaitingPageComponent } from "../waiting-page/waiting-page.component";
import { gameSessionStore } from '../../stores/gameSession.store';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-quiz-description',
  standalone: true,
  imports: [TagListComponent, ButtonComponent, CommonModule, UserInviteComponent, WaitingPageComponent, LayoutComponent],
  templateUrl: './quiz-description.component.html',
  styleUrl: './quiz-description.component.css'
})
export class QuizDescriptionComponent {
  quiz!: Quiz;
  isInviteShowing = false;
  isWaitingPageShowing = false;
  sessionId!: number;

  constructor(private route: ActivatedRoute, private quizService: QuizService, private router: Router,
    private gamestore:gameSessionStore
  ) {}

  ngOnInit(): void {
    let quizId = Number(this.route.snapshot.paramMap.get('id'));
    // if (quizId) {
    //   this.gamestore.updateQuiz(quizId)
    //   this.quizService.getQuizById(quizId).then((data: Quiz) => {
    //     this.quiz = data;
    //   });
    // }
    this.quiz = {
    id: 1,
    nom: 'Quiz de Démo',
    picture: null,
    private: false,
    id_creator: 1,
    questions: [
      {
        id: 1,
        name: 'Quelle est la capitale de la France ?',
        id_answer: 2,
        grade: 1,
        duration: 30,
        id_creator: 1,
        private: false,
        picture: null,
        choices: [
          { id: 1, content: 'Lyon', id_question: 1 },
          { id: 2, content: 'Paris', id_question: 1 },
          { id: 3, content: 'Marseille', id_question: 1 }
        ]
      }
    ],
    tags: ['géographie', 'français'],
    createdBy: 'Admin'
  };
  }

  startQuiz(): void {
    this.isInviteShowing = true;
  }

  handleInviteSubmit(sessionId: number): void {
    this.isWaitingPageShowing = true;
    this.isInviteShowing = false;
    this.sessionId = sessionId;
  }

}
