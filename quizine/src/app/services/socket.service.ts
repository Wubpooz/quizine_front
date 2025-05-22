import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
    socket!: Socket;//must call connect socket before use

    constructor(){
        this.socket = io(
            //window.location.origin, 
            //"http://localhost:3000",
        {
            path: '/api/ws',// le path de ton serveur Socket.IO
            transports: ['websocket']
        });
        this.socket.onAny((event, ...args) => {
            console.log("[Client] Event reçu :", event, args);
          });
    }

    listenGameStart(gamestart:(data:any)=>void) {
        this.socket.on('gamestart', gamestart);
    }

    emitJoin(creator:boolean, sessionId:number, userId:number){
        if (creator) {
            this.socket.emit('eventJoinOrganiser', {sessionId:sessionId, userId:userId});
        }else{
            this.socket.emit('eventJoin', {sessionId:sessionId, userId:userId})
        }
    }
    emitRefuse(sessionId:number, userId:number){
        this.socket.emit('eventRefuse', {sessionId:sessionId, userId:userId})
    }
    emitLeaveRoom(sessionId:number, userId:number){
        this.socket.emit('eventLeave', {sessionId:sessionId, userId:userId})
    }
}