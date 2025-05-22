import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  showPassword = false;
  public username = '';
  public password = '';

  constructor(private apiService: APIService, private appStore: AppStore, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onClose() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.apiService.signup(this.username, this.password).subscribe((data:any) => {
        this.router.navigate(['/login']);
    });
  }
}
