import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { APIService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  quizList: Quiz[] = [];
  filteredQuizList: Quiz[] = [];
  searchTerm: string = '';
  searchDropdownOpen: boolean = false;
  profileDropdownOpen: boolean = false;
  dropdownClicked: boolean = false;
  
  constructor(private router: Router,
    private appStore: AppStore,
    private sidebarService: SidebarService,
    private apiService: APIService,
    public theme: ThemeService
    ) {
      this.appStore.init()
      this.appStore.quizList.subscribe((quizzes) => {
        this.quizList = quizzes||[];
        this.filteredQuizList = quizzes||[];
      });
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
    if(this.profileDropdownOpen && !this.dropdownClicked) {
      this.closeProfileDropdown();
    }
  }

  onProfileClick(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownClicked = true;
    this.gotoProfile();
    this.closeProfileDropdown();
  }

  onLogoutClick(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownClicked = true;
    this.logout();
    this.closeProfileDropdown();
  }

  onDarkModeClick(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownClicked = true;
    this.toggleDarkMode();
    this.closeProfileDropdown();
  }

  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  get isDarkMode(): boolean {
    return this.theme.isDarkMode;
  }

  toggleDarkMode() {
    console.log("Toggling dark mode");
    this.dropdownClicked = true;
    this.theme.toggleDarkMode();
  }

  toggleProfileDropdown() {
    this.profileDropdownOpen = !this.profileDropdownOpen;
    this.dropdownClicked = this.profileDropdownOpen && this.isMobile;
  }
  closeProfileDropdown() {
    this.profileDropdownOpen = false;
    this.dropdownClicked = false;
  }

  logout() {
    this.dropdownClicked = true;
    this.apiService.logout().subscribe({
      next: () => {
        this.appStore.updateUser(undefined as any);
        this.router.navigate(['/landing']);
      }
    });
  }

  toggleSideBar() {
    this.sidebarService.toggle();
  }

  gotoCreateQuiz() {
    this.router.navigate(['/create']);
  }

  gotoProfile() {
    this.dropdownClicked = true;
    this.router.navigate(['/profile']);
  }

  gotoQuiz(quizId: number) {
    this.router.navigate(['quiz-preview/'+quizId]);
  }
}
