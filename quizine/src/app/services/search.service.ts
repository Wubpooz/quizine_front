
import { Injectable } from '@angular/core';
import { SearchType } from '../models/searchModel';
import { User } from '../models/userModel';
import { Quiz } from '../models/quizModel';
import { APIService } from './api.service';
import { AppStore } from '../stores/app.store';
import { GameSessionStore } from '../stores/gameSession.store';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchTerm: string = '';

  // values
  currentUser: User | undefined = undefined;
  friendsList: User[] = [];
  quizList: Quiz[] = [];
  // recentQuizzes: Quiz[] = [];

  constructor(apiService: APIService, appStore: AppStore, gameSessionStore: GameSessionStore) {
    appStore.currentUser.subscribe((user: User | undefined) => {
      this.currentUser = user;
    });
    appStore.friends.subscribe((friends: User[]) => {
      this.friendsList = friends || [];
    });
    appStore.quizList.subscribe((quizzes: Quiz[]) => {
      this.quizList = quizzes || [];
    });
    // appStore.recents.subscribe((quizzes: Quiz[]) => {
    //   this.recentQuizzes = quizzes || [];
    // });
  }

  search(event: Event, type: SearchType, filteringFunction?: (term: string) => void): any {
    const target = event.target as HTMLInputElement | null;
    const term = target ? target.value : '';
    this.searchTerm = term;

    switch (type) {
      case 'all':
        return filteringFunction ? filteringFunction(term) : []; //TODO
      case 'quiz':
        return this.quizList.filter((quiz: Quiz) => {
          return quiz.nom.toLowerCase().includes(term.toLowerCase());
        });
      case 'user':
        return this.friendsList.filter((user: User) => {
          return user.username.toLowerCase().includes(term.toLowerCase());
        });
      default:
        break;
    }
  }
}