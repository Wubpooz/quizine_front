import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSideBarOpen = true;

  get sideBarState(){
    return this.isSideBarOpen ? 'in' : 'out';
  }

  toggleSideBar() {
    this.isSideBarOpen=!this.isSideBarOpen;
  }

  constructor(private router: Router) {}
  
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
}
