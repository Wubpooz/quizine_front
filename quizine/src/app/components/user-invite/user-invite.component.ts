import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { Router } from '@angular/router';
import { AppStore } from '../../stores/app.store';
import { HttpClient } from "@angular/common/http";
import { APIService } from '../../services/api.service';

@Component({
  selector: 'user-invite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-invite.component.html',
  styleUrl: './user-invite.component.css'
})
export class UserInviteComponent {
  @Input() quizId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<number>();
  //? ViewChild
  inviteForm: FormGroup;

  friends!: User[];
  users: User[];
  selectedFriends: number[] = [];
  selectedUsers: number[] = [];
  sessionId!: number;

  constructor(private fb: FormBuilder,
      private appStore: AppStore,
      private router: Router,
      private http: HttpClient,
      private apiservice: APIService
      ) {
    this.inviteForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]]
    });

    this.users = [];

    this.apiservice.getAllUsers().subscribe((friends: User[] | undefined) => {
      console.log(friends)
      this.friends = friends||[];
    });
  }

  ngOnInit(): void {
    let response = this.http.post<any>(`/api/game/create/session/${this.quizId}`, {}, {});
    response.subscribe((payload) => {
      this.sessionId = payload.sessionId;
      console.log("Session ID:", this.sessionId);
    });

    this.appStore.friends.subscribe((friends: User[] | undefined) => {
      this.friends = friends?.filter((friend: User) => {return friend.id !== this.appStore.currentUser.value?.id})||[];
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
      const idsToInvite = this.selectedFriends.concat(this.selectedUsers);
      console.log('Inviting:', idsToInvite);
      this.http.post<any>(`/api/game/gamerequest`, {session: this.sessionId, joueurs: idsToInvite}, {}).subscribe((payload) => {
        console.log("Invitation:", payload);
      });
    }
    this.submit.emit(this.sessionId);
  }
  //commit important
  onSkip() {
    this.submit.emit(this.sessionId);
    //this.router.navigate(['/waiting-room']);
  }

  onClose() {
    this.close.emit();
    this.http.post<any>(`/api/game/delete/participation/${this.sessionId}`, {}, {}).subscribe((payload) => {
      console.log("Deleted participation:", payload);
    });
  }
}