import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { GameSessionStore } from '../../stores/gameSession.store';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { GameConnexionService } from '../../services/gameConnexion.service';
import { APIService } from '../../services/api.service';
import { ButtonComponent } from '../button/button.component';
import { environment } from '../../../environments/environment';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'quiz-score',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './quiz-score.component.html'
})
export class QuizScoreComponent {
  private destroy$ = new Subject<void>();
  currentUser!: User;
  scores!: Map<User, number>;
  sortedScores: { user: User, score: number }[] = [];
  topThree: { user: User, score: number }[] = [];
  userScore: number = 0;

  constructor(
      private gameSessionStore: GameSessionStore,
      private gameConnexion: GameConnexionService,
      private appStore: AppStore,
      private apiService: APIService,
      private notifService: NotificationsService,
      private router: Router,
      private spinnerService: SpinnerService) {

    this.appStore.currentUser.pipe(takeUntil(this.destroy$)).subscribe((user: User | undefined) => {
      if(!user) {
        // this.router.navigate(['/login']); isn't responsible for that
        this.notifService.error('Utilisateur non connecté.');
        return;
      }
      this.spinnerService.show('Chargement des scores…');
      this.currentUser = user;
      this.gameConnexion.connect(); // sessionId has to already be in gameSessionStore

      this.gameConnexion.listenLeaderboard((data: { userId: string; score: number }[]) => {
        if(data && data.length > 0) {
          let scores = new Map<User, number>();
          this.apiService.getAllUsers().pipe(takeUntil(this.destroy$), finalize(() => this.spinnerService.hide())).subscribe((users) => {
            if(!users) {
              return;
            }
            for(let i = 0; i < data.length; i++) {
              let user = users.find(u => u.id === data[i].userId);
              if(!user) {
                continue;
              } 
              scores.set(user, data[i].score);
            }
            this.setScores(scores);
          });
        } else {
          // Fallback to solo mode
          this.setSoloScore();
        }
      });

      // Fallback: if no leaderboard received after a short delay, use solo score
      setTimeout(() => {
        if(this.sortedScores.length === 0) {
          this.spinnerService.hide();
          this.setSoloScore();
        }
      }, 1000);
    });
  }

  ngOnDestroy() {
    this.gameConnexion.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  setScores(scores: Map<User, number>) {
    this.scores = scores;
    this.sortedScores = Array.from(scores.entries())
      .map(([user, score]) => ({ user, score }))
      .sort((a, b) => b.score - a.score);
    this.topThree = this.sortedScores.slice(0, 3);

    for(let [user, score] of scores.entries()) {
      if(user.id === this.currentUser.id) {
        this.userScore = score;
        this.gameConnexion.emitScore(this.userScore, this.gameConnexion.sessionId || "", user.id);
        break;
      }
    }
  }

  setSoloScore() {
    // Only current user, use local score
    const score = this.gameSessionStore.score || 0;
    this.scores = new Map([[this.currentUser, score]]);
    this.sortedScores = [{ user: this.currentUser, score }];
    this.topThree = this.sortedScores;
    this.userScore = score;

    //TODO do better mock data
    if(environment.mockAuth) {
      this.scores = new Map([
        [this.currentUser, score],
        [{
          id: 'mock-user-1',
          username: 'Mock User 1',
          picture: '',
        }, 100],
        [{
          id: 'mock-user-2',
          username: 'Mock User 2',
          picture: '',
        }, 80],
        [{
          id: 'mock-user-3',
          username: 'Mock User 3',
          picture: '',
        }, 60],
      ]);
      this.sortedScores = Array.from(this.scores.entries())
        .map(([user, score]) => ({ user, score }))
        .sort((a, b) => b.score - a.score);
      this.topThree = this.sortedScores.slice(0, 3);
      this.userScore = score;
    }
  }

  selectUser(userId: string): void {
    //TODO go to profile
  }

  next(): void {
    this.router.navigate(['quiz-recap']);
  }
}
