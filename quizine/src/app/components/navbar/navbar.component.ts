import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { APIService } from '../../services/api.service';
import { ThemeService, ThemePreference } from '../../services/theme.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, ButtonComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  private destroy$ = new Subject<void>();
  quizList: Quiz[] = [];
  filteredQuizList: Quiz[] = [];
  searchTerm: string = '';
  searchDropdownOpen: boolean = false;
  
  constructor(private router: Router,
    private appStore: AppStore,
    private sidebarService: SidebarService,
    private apiService: APIService,
    public theme: ThemeService,
    private spinnerService: SpinnerService
    ) {
      // this.appStore.init();
      this.appStore.quizList.pipe(takeUntil(this.destroy$)).subscribe((quizzes: Quiz[]) => {
        this.quizList = quizzes||[];
        this.filteredQuizList = quizzes||[];
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement | null;
    const term = target ? target.value : '';
    this.searchTerm = term;
    const lower = term.toLowerCase();
    this.filteredQuizList = this.quizList.filter(q =>
      q.nom.toLowerCase().includes(lower)
    );
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.searchDropdownOpen = false;
  }

  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  get indicatorTransform(): string {
    const idx: Record<ThemePreference, number> = { light: 0, dark: 1, system: 2 };
    return `translateX(${idx[this.theme.preference] * 100}%)`;
  }

  logout() {
    this.spinnerService.show('Deconnexion…');
    this.apiService.logout().pipe(takeUntil(this.destroy$), finalize(() => this.spinnerService.hide())).subscribe({
      next: () => {
        this.appStore.removeUser();
        this.router.navigate(['/landing']);
      }
    });
  }

  closeSideBar(event: Event) {
    this.sidebarService.setOpen(false);
  }

  toggleSideBar() {
    this.sidebarService.toggle();
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  gotoCreateQuiz() {
    this.router.navigate(['/create']);
  }

  gotoProfile() {
    this.router.navigate(['/profile']);
  }

  gotoQuiz(quizId: string) {
    this.router.navigate(['quiz-preview/'+quizId]);
  }
}
