import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/userModel';
import { EmptyQuiz, HistoryQuiz, Quiz } from '../models/quizModel';
import { Session } from '../models/participationModel';
import { GameRequest } from '../models/participationModel';

@Injectable({
  providedIn: 'root'
})
export class MockAPIService {
  // ======= MOCK DATA =======
  private mockUser: User = {
    id: this.generateRandomString(10),
    username: 'devuser',
    picture: 'assets/images/ProfileLogo.png'
  };

  private mockQuiz: Quiz = {
    id: this.generateRandomString(10),
    nom: 'Quiz de test',
    picture: null,
    private: false,
    id_creator: this.generateRandomString(10),
    questions: [],
    tags: ['test'],
    createdBy: 'devuser'
  };

  private mockQuizzes: Quiz[] = [this.mockQuiz];

  private mockHistory: HistoryQuiz[] = [
    {
      id: this.generateRandomString(10),
      nom: 'Quiz de test',
      picture: null,
      private: false,
      id_creator: this.generateRandomString(10)
    }
  ];

  private mockSession: Session = {
    id: this.generateRandomString(10),
    id_quiz: this.generateRandomString(10)
  };

  private mockGameRequest: GameRequest = {
    datetime: new Date().toISOString(),
    id_session: this.generateRandomString(10),
    id_requestor: this.generateRandomString(10),
    id_validator: this.generateRandomString(10),
    username: 'devuser'
  };

  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }


  // ========== AUTH ==========
  login(username: string, password: string): Observable<User> {
    return of(this.mockUser);
  }

  signup(username: string, password: string): Observable<string> {
    return of('Inscription réussie');
  }

  logout(): Observable<string> {
    return of('Déconnexion réussie');
  }

  // ========== QUIZ ==========
  createEmptyQuiz(emptyQuiz: EmptyQuiz): Observable<Quiz> {
    return of({ ...this.mockQuiz, ...emptyQuiz, id: this.generateRandomString(10)});
  }

  createQuiz(quizData: any): Observable<Quiz> {
    return of({ ...this.mockQuiz, ...quizData, id: this.generateRandomString(10) });
  }

  getQuiz(quizId: string): Observable<Quiz> {
    return of({ ...this.mockQuiz, id: quizId });
  }

  getQuizList(): Observable<Quiz[]> {
    return of(this.mockQuizzes);
  }

  getRecentQuizzes(): Observable<Quiz[]> {
    return of(this.mockQuizzes);
  }

  exploreQuiz(): Observable<Quiz[]> {
    return of(this.mockQuizzes);
  }

  // ========== FRIENDS ==========
  inviteFriend(userId: string): Observable<string> {
    return of('Demande d\'ami envoyée');
  }

  acceptFriend(userId: string): Observable<string> {
    return of('Demande d\'ami acceptée');
  }

  refuseFriend(userId: string): Observable<string> {
    return of('Demande d\'ami refusée');
  }

  getFriends(): Observable<User[]> {
    return of([this.mockUser]);
  }

  // ========== GAME ==========
  requestGame(session: string, players: string[]): Observable<GameRequest[]> {
    return of([this.mockGameRequest]);
  }

  createSession(quizId: string): Observable<Session[]> {
    return of([{ ...this.mockSession, id_quiz: quizId }]);
  }

  getSession(id: string): Observable<Session> {
    return of({ ...this.mockSession, id });
  }

  getNotifications(): Observable<GameRequest[]> {
    return of([this.mockGameRequest]);
  }

  // ========== HISTORY ==========
  getHistory(): Observable<HistoryQuiz[]> {
    return of(this.mockHistory);
  }

  // ========== PROFILE ==========
  getUserData(): Observable<User> {
    return of(this.mockUser);
  }

  // ========== RATE ==========
  addRate(quizId: string, grade: number): Observable<number> {
    return of(grade);
  }

  // ========== SEARCH ==========
  searchQuiz() {
    return [];
  }
  searchUser() {
    return [];
  }
  searchTag() {
    return [];
  }

  getAllUsers(): Observable<User[]> {
    return of([this.mockUser]);
  }

  // ========== WEBSOCKETS ==========
  getScoreboard() {
    return [];
  }
  sendScore() {
    return [];
  }
}