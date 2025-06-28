import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { APIService } from '../../services/api.service';
import { GameConnexionService } from '../../services/gameConnexion.service';

@Component({
  selector: 'user-invite',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-invite.component.html'
})
export class UserInviteComponent {
  @Input() quizId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();
  inviteForm!: FormGroup;

  friends: User[] = [];
  users: User[] = [];
  selectedFriends: string[] = [];
  selectedUsers: string[] = [];
  sessionId!: string;

  constructor(private fb: FormBuilder, private appStore: AppStore,
    private apiservice: APIService,
    private gameConnexion: GameConnexionService) {}
      
  async ngOnInit(): Promise<void> {
    this.inviteForm = this.fb.group({
      // email: ['', [Validators.required, Validators.email]]
    });

    this.apiservice.getAllUsers().subscribe((friends: User[] | undefined) => {
      this.friends = friends?.filter((friend: User) => {return friend.id !== this.appStore.currentUser.value?.id})||[];
    });
    // this.appStore.friends.subscribe((friends: User[] | undefined) => {
      //   this.friends = friends?.filter((friend: User) => {return friend.id !== this.appStore.currentUser.value?.id})||[];
    // });

    this.gameConnexion.connect();
      
    await this.apiservice.createSession(this.quizId).subscribe((sessionId: string) => {
      this.sessionId = sessionId;
      console.log("Created session:", sessionId);
    });
  }

  ngOnDestroy() {
    this.gameConnexion.disconnect();
  }


  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.friends = this.friends.filter((friend: User) => {
      return friend.username.toLowerCase().includes(searchTerm);
    });
  }

  onCheckboxChange(event: any, id: string) {
    if (event.target.checked) {
      this.selectedFriends.push(id);
    } else {
      this.selectedFriends = this.selectedFriends.filter(fid => fid !== id);
    }
  }

  onSubmit() {
    if (this.selectedFriends.length > 0 || this.selectedUsers.length > 0) {
      const idsToInvite = this.selectedFriends.concat(this.selectedUsers);
      console.log('Inviting:', idsToInvite);
      this.apiservice.requestGame(this.sessionId, idsToInvite).subscribe((payload) => {
        console.log("Invitation:", payload);
      });
    }
    this.submit.emit(this.sessionId);
  }

  onSkip() {
    this.submit.emit(this.sessionId);
  }

  onClose() {
    this.close.emit();
    if(this.sessionId) {
      this.apiservice.deleteParticipation(this.sessionId).subscribe((payload) => {
        console.log("Deleted participation:", payload);
      });
    }
  }
}