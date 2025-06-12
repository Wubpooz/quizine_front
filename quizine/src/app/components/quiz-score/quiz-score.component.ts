import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { gameSessionStore } from '../../stores/gameSession.store';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { SocketService } from '../../services/socket.service';
import { APIService } from '../../services/api.service';
import { Session } from '../../models/participationModel';

@Component({
  selector: 'quiz-score',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-score.component.html'
})
export class QuizScoreComponent {
  currentUser!: User;
  scores!: Map<User, number>;
  sortedScores: { user: User, score: number }[] = [];
  topThree: { user: User, score: number }[] = [];
  userScore: number = 0;

  constructor(
    private gameSessionStore: gameSessionStore,
    private socketService: SocketService,
    private appStore: AppStore,
    private apiservice: APIService,
    private router: Router
  ) {
    this.appStore.currentUser.subscribe((user) => {
      if (!user) return;
      this.currentUser = user;

      this.socketService.listenLeaderboard(async (data: { userId: number; score: number }[]) => {
        if (data && data.length > 0) {
          let scores = new Map<User, number>();
          let users = await apiservice.getAllUsers().toPromise();
          if (!users) return;
          for (let i = 0; i < data.length; i++) {
            let u = users.find(u => u.id === data[i].userId);
            if (!u) continue;
            scores.set(u, data[i].score);
          }
          this.setScores(scores);
        } else {
          // Fallback to solo mode
          this.setSoloScore();
        }
      });

      // Fallback: if no leaderboard received after a short delay, use solo score
      setTimeout(() => {
        if (this.sortedScores.length === 0) {
          this.setSoloScore();
        }
      }, 1000);
    });
  }

  setScores(scores: Map<User, number>) {
    this.scores = scores;
    this.sortedScores = Array.from(scores.entries())
      .map(([user, score]) => ({ user, score }))
      .sort((a, b) => b.score - a.score);
    this.topThree = this.sortedScores.slice(0, 3);

    for (let [u, score] of scores.entries()) {
      if (u.id === this.currentUser.id) {
        this.userScore = score;
        this.socketService.emitScore(this.userScore, this.socketService.sessionId || 0, u.id);
        break;
      }
    }
  }

  setSoloScore() {
    // Only current user, use local score
    const score = this.gameSessionStore.score;
    this.scores = new Map([[this.currentUser, score]]);
    this.sortedScores = [{ user: this.currentUser, score }];
    this.topThree = this.sortedScores;
    this.userScore = score;
  }

  selectUser(userId: number): void {
    //TODO optionnal go to other user profile if implemented
  }

  next(): void {
    this.router.navigate(['quiz-recap']);
  }
}
