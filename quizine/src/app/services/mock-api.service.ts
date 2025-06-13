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
    id: 1,
    username: 'devuser',
    picture: 'assets/images/ProfileLogo.png'
  };

  private mockQuiz: Quiz = {
    id: 1,
    nom: 'Quiz de test',
    picture: null,
    private: false,
    id_creator: 1,
    questions: [],
    tags: ['test'],
    createdBy: 'devuser'
  };

  private mockQuizzes: Quiz[] = [this.mockQuiz];

  private mockHistory: HistoryQuiz[] = [
    {
      id: 1,
      nom: 'Quiz de test',
      picture: null,
      private: false,
      id_creator: 1
    }
  ];

  private mockSession: Session = {
    id: 1,
    id_quiz: 1
  };

  private mockGameRequest: GameRequest = {
    datetime: new Date().toISOString(),
    id_session: 1,
    id_requestor: 1,
    id_validator: 2,
    username: 'devuser'
  };

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
    return of({ ...this.mockQuiz, ...emptyQuiz, id: Math.floor(Math.random() * 1000) });
  }

  createQuiz(quizData: any): Observable<Quiz> {
    return of({ ...this.mockQuiz, ...quizData, id: Math.floor(Math.random() * 1000) });
  }

  getQuiz(quizId: number): Observable<Quiz> {
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
  inviteFriend(userId: number): Observable<string> {
    return of('Demande d\'ami envoyée');
  }

  acceptFriend(userId: number): Observable<string> {
    return of('Demande d\'ami acceptée');
  }

  refuseFriend(userId: number): Observable<string> {
    return of('Demande d\'ami refusée');
  }

  getFriends(): Observable<User[]> {
    return of([this.mockUser]);
  }

  // ========== GAME ==========
  requestGame(session: number, players: number[]): Observable<GameRequest[]> {
    return of([this.mockGameRequest]);
  }

  createSession(quizId: number): Observable<Session[]> {
    return of([{ ...this.mockSession, id_quiz: quizId }]);
  }

  getSession(id: number): Observable<Session> {
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
  addRate(quizId: number, grade: number): Observable<number> {
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