import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { gameSessionStore } from '../../stores/gameSession.store';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';

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

  constructor(private gameSessionStore: gameSessionStore,
              private appStore: AppStore,
              private router: Router
        ) { 
    this.appStore.currentUser.subscribe((user) => {
      if(user === undefined){
        return
      }
      this.currentUser = user;
    });
    this.gameSessionStore.scores.subscribe((scores) => {
      this.scores = scores;
      this.sortedScores = Array.from(this.scores.entries()).map(([user, score]) => ({ user, score })).sort((a, b) => b.score - a.score);
      this.topThree = this.sortedScores.slice(0, 3);
    });
  }

  selectUser(userId: number): void {
    //TODO optionnal go to other user profile if implemented
  }

  next(): void {
    this.router.navigate(['quiz-recap']);
  }
}
