import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { GameConnexionService } from '../../services/gameConnexion.service';
import { GameSessionStore } from '../../stores/gameSession.store';

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

  constructor(private router: Router,
    private gameSessionStore: GameSessionStore,
    private apiService:APIService,
    private gameConnexion: GameConnexionService) {
    this.timer = 60;
  }

  async ngOnInit() {
    const currentUser = await this.apiService.getUserData().toPromise(); //TODO use the store
    this.gameSessionStore.sessionId.next(this.sessionId);
    this.gameConnexion.connect();

    this.intervalId = setInterval(() => {
      this.timer -= 1;
      if(this.timer <= 0) {
        clearInterval(this.intervalId);
        this.playQuiz();
      }
    }, 1000);

    if(this.refus === undefined || !this.refus) {

      this.gameConnexion.listenGameStart((data) => {
        clearInterval(this.intervalId);
        this.playQuiz();
      })
      this.gameConnexion.emitJoin(this.isCreator, this.sessionId, currentUser?.id || "None");
    }else{
      if(currentUser) {
        this.gameConnexion.emitRefuse(this.sessionId, currentUser.id);
      }
      this.close.emit();
    }
  }

  
  
  ngOnDestroy() {
    clearInterval(this.intervalId);
    this.gameConnexion.disconnect();
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
    this.gameConnexion.disconnect();
  }
}