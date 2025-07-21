import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { SpinnerService } from '../../services/spinner.service';
import { hasSessionCookie } from '../../utils/utils';

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
    if(hasSessionCookie()) {
      console.log("Session cookie found, attempting connexion...");
      this.apiService.getUserData().pipe(takeUntil(this.destroy$)).subscribe({
        next: (user) => {
          if(user) {
            this.appStore.updateUser(user);
            this.router.navigate(['/home']);
          }
        },
        error: () => {
          this.appStore.removeUser();
        }
      });
    } else {
      console.log("No session cookie found, logging out...");
      this.appStore.removeUser();
    }
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
        // this.appStore.init();
        this.password = '';
        this.appStore.updateUser(user);
        this.router.navigate(['/home']);
      } else {
        this.password = '';
        this.notifService.error('Utilisateur inconnu ou Identifiants incorrects. Veuillez réessayer.', 'Login failed');
        console.error('Login failed');
      }
    });
  }
}