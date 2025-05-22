import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { User } from '../../models/userModel';
import { HistoryQuiz } from '../../models/quizModel';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: User = {id: -1, username: "", picture: ""};
  friends: User[] = [];
  history: HistoryQuiz[] = [];
  showFriends = false;

  constructor(private appStore: AppStore,
            private apiService: APIService,
            private router: Router) {
    this.appStore.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.apiService.getFriends().subscribe((friends: User[] | undefined) => {
      this.friends = friends||[];
      this.appStore.friends.next(friends);
    });
    this.apiService.getHistory().subscribe((history: HistoryQuiz[]) => {
        this.history = history;
    });
  }

  goToQuiz(quizId: number) {
    this.router.navigate(['/quiz-preview', quizId]);
  }

}
