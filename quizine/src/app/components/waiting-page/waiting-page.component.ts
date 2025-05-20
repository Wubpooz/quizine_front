import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'waiting-page',
  standalone: true,
  imports: [],
  templateUrl: './waiting-page.component.html',
  styleUrl: './waiting-page.component.css'
})
export class WaitingPageComponent {

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
        // Implement logic to handle when the timer reaches zero
        this.playQuiz();
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  playQuiz() {
    // Implement logic to start the quiz
    console.log('Starting quiz...');
  }

  formatTimer(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }

  onClose() {
    this.router.navigate(['/quiz/id']); //TODO
  }
}