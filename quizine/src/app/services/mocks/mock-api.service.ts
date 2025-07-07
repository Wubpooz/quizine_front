import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../../models/userModel';
import { EmptyQuiz, HistoryQuiz, Quiz } from '../../models/quizModel';
import { Session } from '../../models/participationModel';
import { GameRequest } from '../../models/participationModel';
import { MockData } from './mockData';

@Injectable({
  providedIn: 'root'
})
export class MockAPIService {
  // ========== AUTH ==========
  login(username: string, password: string): Observable<User> {
    return of(MockData.mockUser);
  }

  signup(username: string, password: string): Observable<string> {
    return of('Inscription réussie');
  }

  logout(): Observable<string> {
    return of('Déconnexion réussie');
  }

  // ========== QUIZ ==========
  createEmptyQuiz(emptyQuiz: EmptyQuiz): Observable<Quiz> {
    return of({ ...MockData.mockQuiz, ...emptyQuiz, id: MockData.generateRandomString(10)});
  }

  createQuiz(quizData: any): Observable<Quiz> {
    return of({ ...MockData.mockQuiz, ...quizData, id: MockData.generateRandomString(10) });
  }

  getQuiz(quizId: string): Observable<Quiz> {
    return of({ ...MockData.mockQuiz, id: quizId });
  }

  getQuizList(): Observable<Quiz[]> {
    return of(MockData.mockQuizzes.filter((quiz: Quiz) => !quiz.private || quiz.id_creator === MockData.mockUser.id));
  }

  getRecentQuizzes(): Observable<HistoryQuiz[]> {
    return of(MockData.mockHistory);
  }

  exploreQuiz(): Observable<Quiz[]> {
    return of(MockData.mockQuizzes);
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
    return of(MockData.mockFriends);
  }

  // ========== GAME ==========
  requestGame(session: string, players: string[]): Observable<GameRequest[]> {
    return of(MockData.mockGameRequestList);
  }

  createSession(quizId: string): Observable<Session[]> {
    return of([{ ...MockData.mockSession, id_quiz: quizId }]);
  }

  getSession(id: string): Observable<Session> {
    return of({ ...MockData.mockSession, id });
  }

  getNotifications(): Observable<GameRequest[]> {
    return of(MockData.mockGameRequestList);
  }

  // ========== HISTORY ==========
  getHistory(): Observable<HistoryQuiz[]> {
    return of(MockData.mockHistory);
  }

  // ========== PROFILE ==========
  getUserData(): Observable<User> {
    return of(MockData.mockUser);
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
    return of(MockData.mockUsers);
  }

  // ========== WEBSOCKETS ==========
  getScoreboard() {
    return [];
  }
  sendScore() {
    return [];
  }
}