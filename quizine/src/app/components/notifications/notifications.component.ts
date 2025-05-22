import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from "../navbar/navbar.component";
import { Notification } from '../../models/userModel';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule,SidebarComponent,NavbarComponent, ButtonComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})

export class NotificationsComponent {
  // Sample notifications data
  notifications: Notification[] = [{
    dateTime: '22/05/2025 ',
    idSession: 2,
    idRequestor:3,
    idValidator:4
  }];



}