import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  showPassword = false;
  public username = '';
  public password = '';
  profileImage: string | ArrayBuffer | null = null;

  constructor(private apiService: APIService, private appStore: AppStore, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onClose() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.apiService.signup(this.username, this.password).subscribe({
      next: () => {
        // Registration successful, now login
        this.apiService.login(this.username, this.password).subscribe({
          next: (loggedUser) => {
            if (loggedUser) {
              this.appStore.init();
              this.appStore.updateUser(loggedUser);
              this.router.navigate(['/home']);
            }
          }
        });
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Optional: validate that it's an image
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
