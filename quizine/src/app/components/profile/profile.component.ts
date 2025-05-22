import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AppStore } from '../../stores/app.store';
import { User } from '../../models/userModel';
import { Quiz } from '../../models/quizModel';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user!: User;
  friends: User[] = [
    { id: 1, username: "Alice", picture: "" },
    { id: 2, username: "Bob", picture: "" },
    { id: 3, username: "Charlie", picture: "" },
    { id: 4, username: "Diana", picture: "" },
    { id: 5, username: "Eve", picture: "" }
  ];
  history: Quiz[] = [
      {
        id: 1,
        nom: "General Knowledge",
        picture: null,
        private: false,
        id_creator: 101,
        questions: [
        {
          id: 1,
          name: "What is the capital of France?",
          id_answer: 1,
          duration: 30,
          private: false,
          choices: [
          { id: 1, content: "Paris", id_question: 1 },
          { id: 2, content: "London", id_question: 1 },
          { id: 3, content: "Berlin", id_question: 1 },
          { id: 4, content: "Madrid", id_question: 1 }
          ]
        },
        {
          id: 2,
          name: "Which planet is known as the Red Planet?",
          id_answer: 2,
          duration: 30,
          private: false,
          choices: [
          { id: 1, content: "Earth", id_question: 2 },
          { id: 2, content: "Mars", id_question: 2 },
          { id: 3, content: "Jupiter", id_question: 2 },
          { id: 4, content: "Venus", id_question: 2 }
          ]
        }
        ],
        tags: ["general", "knowledge"],
        createdBy: "Alice"
      },
      {
        id: 2,
        nom: "Science Quiz",
        picture: null,
        private: true,
        id_creator: 102,
        questions: [
        {
          id: 3,
          name: "What is H2O commonly known as?",
          id_answer: 1,
          duration: 20,
          private: true,
          choices: [
          { id: 1, content: "Water", id_question: 3 },
          { id: 2, content: "Oxygen", id_question: 3 },
          { id: 3, content: "Hydrogen", id_question: 3 },
          { id: 4, content: "Salt", id_question: 3 }
          ]
        }
        ],
        tags: ["science"],
        createdBy: "Bob"
      },
      {
        id: 3,
        nom: "History Facts",
        picture: null,
        private: false,
        id_creator: 103,
        questions: [
        {
          id: 4,
          name: "Who was the first President of the United States?",
          id_answer: 2,
          duration: 25,
          private: false,
          choices: [
          { id: 1, content: "Abraham Lincoln", id_question: 4 },
          { id: 2, content: "George Washington", id_question: 4 },
          { id: 3, content: "Thomas Jefferson", id_question: 4 },
          { id: 4, content: "John Adams", id_question: 4 }
          ]
        }
        ],
        tags: ["history"],
        createdBy: "Charlie"
      },
      {
        id: 4,
        nom: "Math Basics",
        picture: null,
        private: false,
        id_creator: 104,
        questions: [
        {
          id: 5,
          name: "What is 5 + 7?",
          id_answer: 3,
          duration: 15,
          private: false,
          choices: [
          { id: 1, content: "10", id_question: 5 },
          { id: 2, content: "11", id_question: 5 },
          { id: 3, content: "12", id_question: 5 },
          { id: 4, content: "13", id_question: 5 }
          ]
        }
        ],
        tags: ["math"],
        createdBy: "Diana"
      },
      {
        id: 5,
        nom: "Geography Challenge",
        picture: null,
        private: true,
        id_creator: 105,
        questions: [
        {
          id: 6,
          name: "Which is the largest continent?",
          id_answer: 4,
          duration: 20,
          private: true,
          choices: [
          { id: 1, content: "Africa", id_question: 6 },
          { id: 2, content: "Europe", id_question: 6 },
          { id: 3, content: "North America", id_question: 6 },
          { id: 4, content: "Asia", id_question: 6 }
          ]
        }
        ],
        tags: ["geography"],
        createdBy: "Eve"
      }
  ];
  showFriends = false;

  constructor(private appStore: AppStore) {
    this.appStore.currentUser.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    this.appStore.friends.subscribe((friends) => {
      if (friends) {
        this.friends = friends;
      }
    });
    this.appStore.recentHistory.subscribe((history) => {
      if (history) {
        this.history = history;
      }
    });
  }
}
