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
    {id: 1, title: 'Quiz d\'histoire', tags:['aaaa','bbb'],createdBy: 'johndoe',description:'description quiz histoire', questions: [], private: true },
    {id: 2, title: 'Quiz de geo', tags:['aaaa','bbb'],createdBy: 'patate',description:'description quiz geo', questions: [], private: false },
    {id: 3, title: 'Quiz de maths', tags:['aaaa','bbb'],createdBy: 'shrek',description:'description quiz maths', questions: [], private: true },
    {id: 4, title: 'Quiz d\'Harry Potter', tags:['aaaa','bbb'],createdBy: 'snape',description:'avada kedavra', questions: [], private: false },
    {id: 1, title: 'Quiz d\'histoire', tags:['aaaa','bbb'],createdBy: 'johndoe',description:'description quiz histoire', questions: [], private: true },
    {id: 2, title: 'Quiz de geo', tags:['aaaa','bbb'],createdBy: 'patate',description:'description quiz geo', questions: [], private: false },
    {id: 3, title: 'Quiz de maths', tags:['aaaa','bbb'],createdBy: 'shrek',description:'description quiz maths', questions: [], private: true },
    {id: 4, title: 'Quiz d\'Harry Potter', tags:['aaaa','bbb'],createdBy: 'snape',description:'avada kedavra', questions: [], private: false },
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
