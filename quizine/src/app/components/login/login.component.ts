// login.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  showPassword = false;
  public username = '';
  public password = '';

  constructor(private apiService: APIService, private appStore: AppStore, private router: Router) {}

  ngOnInit() {
    this.apiService.getUserData().subscribe({
      next: (user) => {
        this.appStore.updateUser(user);
        if (user) {
            this.router.navigate(['/home']);
          }
      },
      error: () => {}
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onClose() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.apiService.login(this.username, this.password).subscribe((user:User) => {
      if (user) {
        this.appStore.init();
        this.appStore.updateUser(user);
        this.router.navigate(['/home']);
      } else {
        console.error('Login failed');
      }
    });
  }
}