import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'landing',
  standalone: true,
  imports: [],
  templateUrl: './landing.component.html'
})
export class LandingComponent {

  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
