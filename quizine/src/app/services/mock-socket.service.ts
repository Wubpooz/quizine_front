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

  emitJoin(creator: boolean, sessionId: number, userId: number) {
    // No-op or log for dev
  }
  emitRefuse(sessionId: number, userId: number) {
    // No-op or log for dev
  }
  emitLeaveRoom(sessionId: number, userId: number) {
    // No-op or log for dev
  }
  emitScore(score: number, sessionId: number, userId: number) {
    // No-op or log for dev
  }
}