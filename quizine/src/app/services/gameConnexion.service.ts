export abstract class GameConnexionService {
  abstract sessionId: string;

  abstract connect(): void;
  abstract disconnect(): void;

  abstract listenGameStart(callback: (data: any) => void): void;
  abstract listenLeaderboard(callback: (data: any) => void): void;

  abstract emitJoin(creator: boolean, sessionId: string, userId: string): void;
  abstract emitRefuse(sessionId: string, userId: string): void;
  abstract emitLeaveRoom(sessionId: string, userId: string): void;
  abstract emitScore(score: number, sessionId: string, userId: string): void;
}
