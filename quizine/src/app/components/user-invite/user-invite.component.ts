import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import {FriendsStore} from '../../stores/friends.store';
import { Router } from '@angular/router';

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
  selectedFriends: number[] = [];
  selectedUsers: number[] = [];


  constructor(private fb: FormBuilder,
      private friendsStore: FriendsStore,
      private router: Router
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

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedFriends.push(id);
    } else {
      this.selectedFriends = this.selectedFriends.filter(fid => fid !== id);
    }
  }

  onSubmit() {
    if (this.selectedFriends.length > 0 || this.selectedUsers.length > 0) { //useless check in theory
      console.log('Inviting:', this.selectedFriends);
      let idsToInvite = this.selectedFriends.concat(this.selectedUsers);
      //api call idsToInvite
    }
    this.router.navigate(['/waiting-room']);
  }

  onSkip() {
    this.router.navigate(['/waiting-room']);
  }

  onClose() {
    console.log('Close action triggered');
  }
}