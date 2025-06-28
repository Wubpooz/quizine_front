import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';
import { LayoutComponent } from '../layout/layout.component';
import { WebsiteStatusButtonComponent } from "../website-status-button/website-status-button.component";

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule, LayoutComponent, WebsiteStatusButtonComponent],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {
  quizzes: Quiz[] = [];

  constructor(private router: Router, private appStore: AppStore) {
    appStore.init()
    this.appStore.recents.subscribe((quizzes) => {
      this.quizzes = quizzes||[];
    });
  }

  gotoQuiz(quizId: string) {
    this.router.navigate(['/quiz-preview', quizId]);
  }
}
