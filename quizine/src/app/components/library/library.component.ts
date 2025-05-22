import { Component } from '@angular/core';
import { Quiz } from '../../models/quizModel';
import { LibraryQuizCardComponent } from "./library-quiz-card/library-quiz-card.component";
import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [LibraryQuizCardComponent, CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent {
  quizList: Quiz[] = [];

  constructor(private router: Router,
    private apiService: APIService
    ) {
      this.apiService.getQuizList().subscribe((quizList: Quiz[]) => {
        if(quizList) {
          this.quizList = quizList;
        }
      });
  }

  goToCreateQuiz() {
    this.router.navigate(['/create']);
  }
}
