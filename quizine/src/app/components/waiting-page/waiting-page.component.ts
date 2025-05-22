import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'waiting-page',
  standalone: true,
  imports: [],
  templateUrl: './waiting-page.component.html',
  styleUrl: './waiting-page.component.css'
})
export class WaitingPageComponent {
  @Input() isCreator!: boolean;
  @Input() sessionId!: number;
  @Output() close = new EventEmitter<void>();
  timer: number;
  private intervalId: any;

  constructor(private router: Router, private http: HttpClient) {
    this.timer = 60;
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.timer -= 1;
      if (this.timer <= 0) {
        clearInterval(this.intervalId);
        this.playQuiz();
      }
    }, 1000);
    console.log("isCreator = " + this.isCreator);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
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
    this.http.post<any>(`/api/game/delete/participation/${this.sessionId}`, {}, {}).subscribe((payload) => {
      console.log("Deleted participation:", payload);
    });
  }
}