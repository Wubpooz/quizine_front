import { Component } from '@angular/core';
import { QuizCardComponent } from '../quiz-card/quiz-card.component';
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { AppStore } from '../../stores/app.store';
import { LayoutComponent } from '../layout/layout.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [QuizCardComponent, CommonModule, LayoutComponent],
  templateUrl: './explore.component.html'
})
export class ExploreComponent {
  private destroy$ = new Subject<void>();
  quizList: Quiz[] = [];
  filteredQuizList: Quiz[] = [];
  searchTerm: string = '';

  constructor(private appStore: AppStore) {
    this.appStore.init()
    this.appStore.quizList.pipe(takeUntil(this.destroy$)).subscribe((quizzes) => {
      this.quizList = quizzes||[];
      this.filteredQuizList = quizzes||[];
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    const term = target ? target.value : '';
    this.searchTerm = term;
    const lower = term.toLowerCase();
    this.filteredQuizList = this.quizList.filter(q =>
      q.nom.toLowerCase().includes(lower)
    );
  }

}
