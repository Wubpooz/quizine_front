import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  isSideBarOpen=true;
  quizzes = [
    { title: 'Quiz d\'histoire', questions: 16, author: 'johndoe', date: '23.23.3/2025' },
    // Add more quizzes...
  ];

  constructor(private router: Router) {}

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
  
}
