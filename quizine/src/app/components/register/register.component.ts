import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { SpinnerService } from '../../services/spinner.service';
import { User } from '../../models/userModel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private destroy$ = new Subject<void>();
  showPassword = false;
  public username = '';
  public password = '';
  profileImage: string | ArrayBuffer | null = null;

  constructor(private apiService: APIService, private appStore: AppStore, 
    private notifService: NotificationsService, private router: Router,
    private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.apiService.getUserData().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user: User|null) => {
        if(user) {
          this.appStore.updateUser(user);
          this.router.navigate(['/home']);
        } else {
          this.appStore.removeUser();
        }
      },
      error: () => {
        this.appStore.removeUser();
      }
    });
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onClose() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.spinnerService.show('Inscription…');
    this.apiService.signup(this.username, this.password).pipe(
      takeUntil(this.destroy$),
      switchMap(() => 
        this.apiService.login(this.username, this.password)
      ),
      finalize(() => this.spinnerService.hide())
    ).subscribe({
      next: (loggedUser) => {
        if(loggedUser) {
          // this.appStore.init();
          this.appStore.updateUser(loggedUser);
          this.router.navigate(['/home']);
        } else {
          console.error('Auto-login returned no user');
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Signup or auto-login failed:', err);
        this.notifService.error('Erreur lors de l\'inscription ou de la connexion.');
      }
    });
  }



  onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if(input.files && input.files.length > 0) {
    const file = input.files[0];

    // Validate it's an image by MIME type
    if(!file.type.startsWith('image/')) {
      console.warn('Selected file is not an image.');
      this.notifService.error('Veuillez choisir une image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if(this.validateIcon(result)) {
        this.profileImage = result;
      } else {
        console.warn('Invalid image format.');
        this.notifService.error('Format d\'image invalide.');
      }
    };
    reader.readAsDataURL(file);
  }
}

  validateIcon(dataUrl: string): boolean {
    return /^data:image\/(jpeg|png|gif|webp|bmp);base64,/.test(dataUrl);
  }

  validatePassword(password: string): boolean {
    return password.length >= 8 && password.length <= 20 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
