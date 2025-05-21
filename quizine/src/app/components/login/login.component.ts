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
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = false;
  private username = '';
  private password = '';

  constructor(private apiService: APIService, private appStore: AppStore, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.apiService.login(this.username, this.password).subscribe((user:User) => {
      if (user) {
        this.appStore.updateUser(user);
        this.router.navigate(['/home']);
      } else {
        // Handle login error
        console.error('Login failed');
      }
    });
  }
}