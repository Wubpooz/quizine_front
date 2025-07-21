import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';
import { LayoutComponent } from '../layout/layout.component';
import { QuizCardComponent } from "../quiz-card/quiz-card.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, LayoutComponent, QuizCardComponent],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  private destroy$ = new Subject<void>();
  quizzes: Quiz[] = [];

  constructor(private router: Router, private appStore: AppStore) {
    //TODO remove all of them since it should be "updateUser" at login, register or at page reload (in appComponent)
    // appStore.init();
    this.appStore.recents.pipe(takeUntil(this.destroy$)).subscribe((quizzes: Quiz[]) => {
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
