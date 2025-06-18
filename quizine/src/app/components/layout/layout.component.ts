import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'layout',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, CommonModule],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  constructor(private sidebarService: SidebarService) {}

  handleContentClick(event: MouseEvent) {
    this.sidebarService.setOpen(false);
  }
}