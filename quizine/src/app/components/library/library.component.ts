import { Component } from '@angular/core';
import { Quiz } from '../../models/quizModel';
import { LibraryQuizCardComponent } from "./library-quiz-card/library-quiz-card.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryQuizCardComponent, CommonModule, LayoutComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {
  quizList: Quiz[] = [];
  filteredQuizList: Quiz[] = [];
  searchTerm: string = '';

  constructor(private router: Router,
    private apiService: APIService
    ) {
      this.apiService.getQuizList().subscribe((quizList: Quiz[]) => {
        if(quizList) {
          this.quizList = quizList;
          this.filteredQuizList = quizList;
        }
      });
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

  goToCreateQuiz() {
    this.router.navigate(['/create']);
  }
}
