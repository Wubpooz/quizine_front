import { Component } from '@angular/core';
import {trigger,state,style, animate, transition} from '@angular/animations'
import { CommonModule } from '@angular/common';

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

  get sideBarState(){
    return this.isSideBarOpen ? 'in' : 'out';
  }

  toggleSideBar() {
    this.isSideBarOpen=!this.isSideBarOpen;
  }
  onCreateQuiz() {
    console.log('Create Quiz button clicked');
    // Navigate to quiz creation page
  }
  
}
