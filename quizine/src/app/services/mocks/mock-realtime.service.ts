import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { GameConnexionService } from '../gameConnexion.service';

@Injectable({
  providedIn: 'root'
})
export class MockRealtimeService extends GameConnexionService {
    socket!: Socket;//must call connect socket before use
    sessionId?: string = undefined;

    constructor() {
        super();
        this.socket = io(
            'https://quizine-backend.vercel.app',
            // window.location.origin,
            //"http://localhost:3000",
            {
                path: '/api/ws',
                transports: ['websocket'],
                autoConnect: false
        });
        this.socket.onAny((event, ...args) => {
            console.log("[Client] Event reçu :", event, args);
        });
    }

    connect() {
        this.socket.connect();
    }

    disconnect() {
        this.socket.disconnect();
    }


    listenGameStart(gamestart:(data: any) => void) {
        this.socket.on('gamestart', gamestart);
    }
    listenLeaderboard(leaderboard:(data: any) => void) {
        this.socket.on('leaderboard', leaderboard);
    }


    emitJoin(creator: boolean, sessionId: string, userId: string) {
        if(!this.sessionId) {
            this.sessionId = sessionId;
        }
        if(creator) {
            this.socket.emit('eventJoinOrganiser', {sessionId:sessionId, userId:userId});
        }else {
            this.socket.emit('eventJoin', {sessionId:sessionId, userId:userId});
        }
    }

    emitRefuse(sessionId: string, userId: string) {
        this.socket.emit('eventRefuse', {sessionId:sessionId, userId:userId})
    }

    emitLeaveRoom(sessionId: string, userId: string) {
        this.socket.emit('eventLeave', {sessionId:sessionId, userId:userId})
    }

    emitScore(score: number, sessionId: string, userId: string) {
        this.socket.emit('sendScore', { score:score, userId:userId, sessionId:sessionId })
    }
}