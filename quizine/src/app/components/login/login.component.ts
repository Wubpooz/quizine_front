// login.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword = false;
  username = '';   // <-- bound to input
  password = '';   // <-- bound to input

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    // You can now send these values to backend via HTTP request
  }
}