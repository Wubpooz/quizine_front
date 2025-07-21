import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'website-status-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './website-status-button.component.html'
})
export class WebsiteStatusButtonComponent {

  constructor(public theme: ThemeService) {}
}
