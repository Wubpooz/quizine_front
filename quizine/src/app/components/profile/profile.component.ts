import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { User } from '../../models/userModel';
import { Quiz } from '../../models/quizModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user!: User;
  friends: User[] = [];
  history: Quiz[] = [];
  showFriends = false;

  constructor(private appStore: AppStore,
            private router: Router) {
    this.appStore.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.appStore.friends.subscribe((friends) => {
      if (friends) {
        this.friends = friends;
      }
    });
    this.appStore.recentHistory.subscribe((history) => {
      if (history) {
        this.history = history;
      }
    });
  }

  goToQuiz(quizId: number) {
    this.router.navigate(['/quiz-preview', quizId]);
  }

}
