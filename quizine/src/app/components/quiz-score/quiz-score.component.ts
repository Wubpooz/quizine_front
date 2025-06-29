import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { GameSessionStore } from '../../stores/gameSession.store';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { GameConnexionService } from '../../services/gameConnexion.service';
import { APIService } from '../../services/api.service';

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
    private gameSessionStore: GameSessionStore,
    private gameConnexion: GameConnexionService,
    private appStore: AppStore,
    private apiService: APIService,
    private router: Router
  ) {
    this.appStore.currentUser.subscribe((user) => {
      if(!user) {
        return;
      }
      this.currentUser = user;
      this.gameConnexion.connect(); //TODO sessionId should be in gameSessionStore

      this.gameConnexion.listenLeaderboard(async (data: { userId: string; score: number }[]) => {
        if(data && data.length > 0) {
          let scores = new Map<User, number>();
          let users = await apiService.getAllUsers().toPromise();
          
          if(!users){
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
        } else {
          // Fallback to solo mode
          this.setSoloScore();
        }
      });

      // Fallback: if no leaderboard received after a short delay, use solo score
      setTimeout(() => {
        if(this.sortedScores.length === 0) {
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
    const score = this.gameSessionStore.score;
    this.scores = new Map([[this.currentUser, score]]);
    this.sortedScores = [{ user: this.currentUser, score }];
    this.topThree = this.sortedScores;
    this.userScore = score;
  }

  selectUser(userId: string): void {
    //TODO optionnal go to other user profile if implemented
  }

  next(): void {
    this.router.navigate(['quiz-recap']);
  }
}
