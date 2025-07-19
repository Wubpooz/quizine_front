import { Component } from '@angular/core';
import { TagListComponent } from "../tag-list/tag-list.component";
import { ButtonComponent } from "../button/button.component";
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { UserInviteComponent } from "../user-invite/user-invite.component";
import { WaitingPageComponent } from "../waiting-page/waiting-page.component";
import { GameSessionStore } from '../../stores/gameSession.store';
import { LayoutComponent } from '../layout/layout.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-quiz-description',
  standalone: true,
  imports: [TagListComponent, ButtonComponent, CommonModule, UserInviteComponent, WaitingPageComponent, LayoutComponent],
  templateUrl: './quiz-description.component.html'
})
export class QuizDescriptionComponent {
  quiz!: Quiz;
  isInviteShowing = false;
  isWaitingPageShowing = false;
  sessionId!: string;

  constructor(private route: ActivatedRoute,
    private quizService: QuizService,
    private notifService: NotificationsService,
    private router: Router,
    private gameSessionStore: GameSessionStore) {}

  ngOnInit(): void {
    let quizId = this.route.snapshot.paramMap.get('id');
    if(quizId) {
      this.gameSessionStore.updateQuiz(quizId);
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

  goToProfile(id: string): void { //TODO
    console.warn('Not implemented.');
    // this.router.navigate(['/profile', id]);
  }

  startQuiz(): void {
    if(!this.quiz) {
      console.error('Quiz not loaded.');
      this.notifService.error('Unexpected error. Can\'t start quiz.', 'Quiz not loaded');
      return;
    }
    this.gameSessionStore.quiz.next(this.quiz);
    this.isInviteShowing = true;
  }

  handleInviteSubmit(sessionId: string): void {
    console.log('Invite submitted for session:', sessionId);
    this.isWaitingPageShowing = true;
    this.isInviteShowing = false;
    this.sessionId = sessionId;
    this.gameSessionStore.sessionId.next(sessionId);
  }

}
