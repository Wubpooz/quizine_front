import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';
import { LayoutComponent } from '../layout/layout.component';
import { WebsiteStatusButtonComponent } from "../website-status-button/website-status-button.component";
import { QuizCardComponent } from "../quiz-card/quiz-card.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, LayoutComponent, WebsiteStatusButtonComponent, QuizCardComponent],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  private destroy$ = new Subject<void>();
  quizzes: Quiz[] = [];

  constructor(private router: Router, private appStore: AppStore) {
    appStore.init()
    this.appStore.recents.pipe(takeUntil(this.destroy$)).subscribe((quizzes) => {
      this.quizzes = quizzes||[];
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  gotoQuiz(quizId: string) {
    this.router.navigate(['/quiz-preview', quizId]);
  }
}
