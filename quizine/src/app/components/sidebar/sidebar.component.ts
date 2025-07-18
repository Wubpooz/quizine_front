import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Quiz } from '../../models/quizModel';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  isSideBarOpen: boolean = true;
  quizList: Quiz[] = [];
  filteredQuizList: Quiz[] = [];
  searchTerm: string = '';
  notificationCount: number = 0;


  constructor(private router: Router, private sidebarService: SidebarService, private appStore: AppStore) {
    this.sidebarService.isOpen$.subscribe(open => this.isSideBarOpen = open);
    this.appStore.init()
    this.appStore.quizList.subscribe((quizzes) => {
      this.quizList = quizzes||[];
      this.filteredQuizList = quizzes||[];
    });

    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     if (this.isMobile()) {
    //       this.sidebarService.setOpen(false);
    //     }
    //     // const stored = localStorage.getItem('sidebarOpen');
    //     // this.sidebarService.setOpen(stored === null ? !this.isMobile() : stored === 'true');
    //   }
    // });

    this.appStore.notifications.subscribe((notifications) => {
      if(notifications) {
        this.notificationCount = notifications.length;
      } else {
        this.notificationCount = 0;
      }
    });
  }

  get sideBarState(){
    return this.isSideBarOpen ? 'in' : 'out';
  }

  closeSideBar() {
    this.sidebarService.setOpen(false);
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
  
  goToHomepage() {
    this.router.navigate(['/home']);
  }

  goToLibrary() {
    this.router.navigate(['/library']);
  }

  goToExplore() {
    this.router.navigate(['/explore']);
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
  }

  gotoQuiz(quizId: string) {
    this.router.navigate(['quiz-preview/'+quizId]);
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}
