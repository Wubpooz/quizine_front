import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showFriends = false;
  friends = [
    { name: 'Alice' },
    { name: 'Bob' },
    { name: 'Charlie' }
    // ...add real friends here
  ];
}
