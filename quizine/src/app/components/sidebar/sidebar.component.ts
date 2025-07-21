import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';
import { Quiz } from '../../models/quizModel';
import { AppStore } from '../../stores/app.store';
import { Subject, takeUntil } from 'rxjs';
import { GameRequest } from '../../models/participationModel';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent {
  private destroy$ = new Subject<void>();
  isSideBarOpen: boolean = true;
  quizList: Quiz[] = [];
  filteredQuizList: Quiz[] = [];
  searchTerm: string = '';
  notificationCount: number = 0;


  constructor(private router: Router, private sidebarService: SidebarService, private appStore: AppStore) {
    this.sidebarService.isOpen$.pipe(takeUntil(this.destroy$)).subscribe((open) => this.isSideBarOpen = open);
    // this.appStore.init()
    this.appStore.quizList.pipe(takeUntil(this.destroy$)).subscribe((quizzes: Quiz[]) => {
      this.quizList = quizzes||[];
      this.filteredQuizList = quizzes||[];
    });

    this.appStore.notifications.pipe(takeUntil(this.destroy$)).subscribe((notifications: GameRequest[]) => {
      this.notificationCount = notifications ? notifications.length : 0;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.filteredQuizList = this.quizList.filter((quiz: Quiz) =>
      quiz.nom.toLowerCase().includes(lower)
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
}
