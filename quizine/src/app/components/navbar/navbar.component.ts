import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
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
    private apiService: APIService
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

  get isMobile(): boolean {
    return window.innerWidth <= 768;
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
    this.router.navigate(['/profile']);
  }

  gotoQuiz(quizId: number) {
    this.router.navigate(['quiz-preview/'+quizId]);
  }
}
