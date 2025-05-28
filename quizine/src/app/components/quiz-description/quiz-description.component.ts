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
    if (quizId) {
      this.gamestore.updateQuiz(quizId)
      this.quizService.getQuizById(quizId).then((data: Quiz) => {
        if(data) {
          this.quiz = data;
        } else {
          this.router.navigate(['/404'], { replaceUrl: true });
        }
      }).catch(() => {
        this.router.navigate(['/404'], { replaceUrl: true });
      });
    } else {
      this.router.navigate(['/404'], { replaceUrl: true });
    }
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
