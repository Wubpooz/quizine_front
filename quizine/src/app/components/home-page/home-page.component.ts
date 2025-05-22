import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  isSideBarOpen=true;
  quizzes: Quiz[] = [];

  constructor(private router: Router,
    private appStore: AppStore,
  ) {
    this.appStore.recentHistory.subscribe((quizzes) => {
      this.quizzes = quizzes;
      console.log("quizzes", quizzes);
    });
  }

  get sideBarState(){
    return this.isSideBarOpen ? 'in' : 'out';
  }

  toggleSideBar() {
    this.isSideBarOpen=!this.isSideBarOpen;
  }


  gotoHome() {
    this.router.navigate(['/home']);
  }
  gotoLibrary() {
    this.router.navigate(['/library']);
  }
  gotoExplore() {
    this.router.navigate(['/explore']);
  }
  gotoCreateQuiz() {
    this.router.navigate(['/create-quiz']);
  }
  gotoProfile() {
    this.router.navigate(['/profile']);
  }
  gotoQuiz(quizId: number) {
    this.router.navigate(['/quiz-preview', quizId]);
  }
}
