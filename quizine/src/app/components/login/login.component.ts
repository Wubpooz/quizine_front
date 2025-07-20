// login.component.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private destroy$ = new Subject<void>();
  showPassword = false;
  public username = '';
  public password = '';

  constructor(private apiService: APIService, private appStore: AppStore,
    private router: Router, private notifService: NotificationsService,
    private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.apiService.getUserData().pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.appStore.updateUser(user);
        if(user) {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.notifService.error('Connexion au serveur impossible. Veuillez reafficher la page.', 'Connection error');
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
    this.spinnerService.show('Connexion…');
    this.apiService.login(this.username, this.password).pipe(takeUntil(this.destroy$), finalize(() => this.spinnerService.hide())).subscribe((user: User) => {
      if(user) {
        this.appStore.init();
        this.appStore.updateUser(user);
        this.router.navigate(['/home']);
      } else {
        this.notifService.error('Utilisateur inconnu ou Identifiants incorrects. Veuillez réessayer.', 'Login failed');
        console.error('Login failed');
      }
    });
  }
}