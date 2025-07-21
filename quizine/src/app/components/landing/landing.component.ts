import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebsiteStatusButtonComponent } from '../website-status-button/website-status-button.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'landing',
  standalone: true,
  imports: [WebsiteStatusButtonComponent, ButtonComponent],
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
