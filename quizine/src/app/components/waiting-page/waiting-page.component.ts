import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'waiting-page',
  standalone: true,
  imports: [],
  templateUrl: './waiting-page.component.html',
  styleUrl: './waiting-page.component.css'
})
export class WaitingPageComponent {
  @Input() isCreator!: boolean;
  @Output() close = new EventEmitter<void>();
  timer: number;
  private intervalId: any;


  constructor(private router: Router) {
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
    //this.router.navigate(['/quiz/id']); //TODO
    this.close.emit();
  }
}