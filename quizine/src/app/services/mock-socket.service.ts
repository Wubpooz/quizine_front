import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockSocketService {
  private gameStartSubject = new Subject<any>();
  private leaderboardSubject = new Subject<any>();

  // Simulate server events
  emitFakeGameStart(data: any) {
    this.gameStartSubject.next(data);
  }
  emitFakeLeaderboard(data: any) {
    this.leaderboardSubject.next(data);
  }

  listenGameStart(callback: (data: any) => void) {
    this.gameStartSubject.subscribe(callback);
  }
  listenLeaderboard(callback: (data: any) => void) {
    this.leaderboardSubject.subscribe(callback);
  }

  emitJoin(creator: boolean, sessionId: string, userId: string) {
    // No-op or log for dev
  }
  emitRefuse(sessionId: string, userId: string) {
    // No-op or log for dev
  }
  emitLeaveRoom(sessionId: string, userId: string) {
    // No-op or log for dev
  }
  emitScore(score: number, sessionId: string, userId: string) {
    // No-op or log for dev
  }
}