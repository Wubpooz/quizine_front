import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'user-invite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-invite.component.html',
  styleUrl: './user-invite.component.css'
})
export class UserInviteComponent {
  @Output() close = new EventEmitter<void>();
  //? ViewChild
  inviteForm: FormGroup;

  friends!: User[];
  users: User[];
  selectedFriends: number[] = [];
  selectedUsers: number[] = [];


  constructor(private fb: FormBuilder,
      private appStore: AppStore,
      private router: Router
      ) {
    this.inviteForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]]
    });

    this.users = [];

    this.appStore.friends.subscribe((friends: User[] | undefined) => {
      this.friends = friends||[];
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.friends = this.friends.filter((friend: User) => {
      return friend.username.toLowerCase().includes(searchTerm);
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
      //TODO api call idsToInvite
    }
    this.router.navigate(['/waiting-room']);
  }

  onSkip() {
    this.router.navigate(['/waiting-room']);
  }

  onClose() {
    this.close.emit();
  }
}