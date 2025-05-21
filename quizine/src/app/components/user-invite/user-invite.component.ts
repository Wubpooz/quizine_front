import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import {FriendsStore} from '../../stores/friends.store';

@Component({
  selector: 'user-invite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-invite.component.html',
  styleUrl: './user-invite.component.css'
})
export class UserInviteComponent {
  //? ViewChild
  inviteForm: FormGroup;

  friends!: User[];
  users: User[];


  constructor(private fb: FormBuilder,
      private friendsStore: FriendsStore
      ) {
    this.inviteForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]]
    });

    this.users = [];

    this.friendsStore.friends.subscribe((friends: User[]) => {
      this.friends = friends;
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.friends = this.friends.filter((friend: User) => {
      return friend.name.toLowerCase().includes(searchTerm) || friend.email.toLowerCase().includes(searchTerm);
    });
  }

  onCheckboxChange(event: any) {
    const checkboxes = event.target.parentElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox: HTMLInputElement) => {
      if (checkbox !== event.target) {
        checkbox.checked = false;
      }
    });
  }

  onSubmit() {
    if (this.inviteForm.valid) {
      // Handle form submission
      console.log(this.inviteForm.value);
    }
  }

  onSkip() {
    // Handle skip action
    console.log('Skip action triggered');
  }

  onClose() {
    // Handle close action
    console.log('Close action triggered');
  }
}