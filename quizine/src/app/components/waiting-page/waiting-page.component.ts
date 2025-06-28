import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { io, Socket } from 'socket.io-client';
import { APIService } from '../../services/api.service';
import { SocketService } from '../../services/connexionServices/socket.service';

@Component({
  selector: 'waiting-page',
  standalone: true,
  imports: [],
  templateUrl: './waiting-page.component.html'
})
export class WaitingPageComponent {
  @Input() isCreator!: boolean;
  @Input() sessionId!: string;
  @Input() refus?:boolean;
  @Output() close = new EventEmitter<void>();
  timer: number;
  private intervalId: any;

  constructor(private router: Router, private http: HttpClient, private apiService:APIService, private socketService: SocketService) {
    this.timer = 60;
  }

  async ngOnInit() {
    // console.log("SESSION", this.sessionId)
    let me = await this.apiService.getUserData().toPromise();
    this.socketService.connect();

    this.intervalId = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        clearInterval(this.intervalId);
        this.playQuiz();
      }
    }, 1000);
    // console.log("isCreator = " + this.isCreator);
    if(this.refus === undefined || this.refus === false) {
      // console.log("EMIT JOIN STP")
      this.socketService.listenGameStart((data) => {
        // console.log(data)
        clearInterval(this.intervalId);
        this.playQuiz();
      })
      this.socketService.emitJoin(this.isCreator, this.sessionId, me?.id || "None");
    }else{
    
      if(me)
        this.socketService.emitRefuse(this.sessionId, me.id)
      this.close.emit()
    }
  }

  
  
  ngOnDestroy() {
    clearInterval(this.intervalId);
      this.socketService.disconnect();
  }

  playQuiz() {
    //TODO send api call
    // this.router.navigate(['/quiz']);
    this.router.navigate(['/quiz-question']);
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  onClose() {
    this.close.emit();
    this.apiService.deleteParticipation(this.sessionId);
    this.socketService.disconnect();
  }
}