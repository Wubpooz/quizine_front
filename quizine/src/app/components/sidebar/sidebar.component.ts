import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSideBarOpen = true;

  constructor(private router: Router, private sidebarService: SidebarService) {
    this.sidebarService.isOpen$.subscribe(open => this.isSideBarOpen = open);
  }

  get sideBarState(){
    return this.isSideBarOpen ? 'in' : 'out';
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
}
