import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { User } from '../../models/userModel';
import { HistoryQuiz } from '../../models/quizModel';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { LayoutComponent } from "../layout/layout.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private destroy$ = new Subject<void>();
  user: User = {id: "", username: "", picture: ""};
  friends: User[] = [];
  history: HistoryQuiz[] = [];
  showFriends = false;

  constructor(private appStore: AppStore, private apiService: APIService, private router: Router) {
    this.appStore.currentUser.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.apiService.getFriends().pipe(takeUntil(this.destroy$)).subscribe((friends: User[] | undefined) => {
      this.friends = friends||[];
      this.appStore.friends.next(friends);
    });
    this.apiService.getHistory().pipe(takeUntil(this.destroy$)).subscribe((history: HistoryQuiz[]) => {
      this.history = history;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goToQuiz(quizId: string) {
    this.router.navigate(['/quiz-preview', quizId]);
  }
}
