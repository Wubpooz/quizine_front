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
  templateUrl: './quiz-score.component.html',
  styleUrl: './quiz-score.component.css'
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

      socketService.listenLeaderboard(async (data:{
        userId: number;
        score: number;
    }[])=>{
      let scores = new Map<User, number>();
      let users = await apiservice.getAllUsers().toPromise();
      if(!users)
        return
      for(let i = 0; i<data.length; i++){
        let u = users.find(u=>u.id === data[i].userId);
        if(!u)
          continue
        scores.set(u, data[i].score)
      }

      this.scores = scores;

        this.sortedScores = Array.from(scores.entries())
          .map(([user, score]) => ({ user, score }))
          .sort((a, b) => b.score - a.score);

        this.topThree = this.sortedScores.slice(0, 3);

        for (let [u, score] of scores.entries()) {
          if (u.id === this.currentUser.id) {
            this.userScore = score;
            console.log('userScore', this.userScore);
            break;
          }
        }
    })
   
      this.gameSessionStore.scores.subscribe((scores) => {
        for (let [u, score] of scores.entries()) {
          if (u.id === this.currentUser.id) {
            this.userScore = score;
            socketService.emitScore(this.userScore, socketService.sessionId||0, u.id)
            console.log('userScore', this.userScore);
            break;
          }
        }
      });
    });
  }

  selectUser(userId: number): void {
    //TODO optionnal go to other user profile if implemented
  }

  next(): void {
    this.router.navigate(['quiz-recap']);
  }
}
