import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { User } from '../../models/userModel';
import { AppStore } from '../../stores/app.store';
import { APIService } from '../../services/api.service';
import { GameConnexionService } from '../../services/gameConnexion.service';
import { GameSessionStore } from '../../stores/gameSession.store';
import { ButtonComponent } from '../button/button.component';
import { combineLatest, finalize, forkJoin, Subject, take, takeUntil } from 'rxjs';
import { NotificationsService } from '../../services/notifications.service';
import { SpinnerService } from '../../services/spinner.service';
import { GameRequest } from '../../models/participationModel';

@Component({
  selector: 'user-invite',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule],
  templateUrl: './user-invite.component.html'
})
export class UserInviteComponent {
  private destroy$ = new Subject<void>();
  @Input() quizId!: string;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<string>();
  inviteForm!: FormGroup;

  friends: User[] = [];
  users: User[] = [];
  selectedFriends: User[] = [];
  selectedUsers: User[] = [];
  sessionId!: string;

  searchTerm: string = '';
  searchDropdownOpen: boolean = false;
  filteredUsersList: User[] = [];

  constructor(private fb: FormBuilder,
    private appStore: AppStore,
    private gameSessionStore: GameSessionStore,
    private apiservice: APIService,
    private gameConnexion: GameConnexionService,
    private notifService: NotificationsService,
    private spinnerService: SpinnerService) {}
      
  ngOnInit(): void {
    this.inviteForm = this.fb.group({});
   
    this.spinnerService.show('Chargement des utilisateurs…');

    combineLatest([
      this.apiservice.getAllUsers(), //TODO temporary, use search service instead with that
      this.appStore.friends.pipe(take(1)),
      this.apiservice.createSession(this.quizId)
    ]).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.spinnerService.hide())
    ).subscribe({
      next: ([users, friends, sessionId]) => {
        const currentUserId = this.appStore.currentUser.value?.id;

        this.users = users.filter(u => u.id !== currentUserId);
        this.friends = (friends || []).filter(f => f.id !== currentUserId);
        this.users.sort((a, b) => a.username.localeCompare(b.username));
        this.updateFilteredUsersList();

        this.sessionId = sessionId;
        console.log("Created session:", sessionId);
        this.gameSessionStore.sessionId.next(sessionId);
        this.gameConnexion.connect();
      },
      error: (err) => {
        console.error("Error during setup:", err);
        this.notifService.error("Une erreur est survenue lors du chargement");
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.gameConnexion.disconnect();
  }

  private updateFilteredUsersList() {
    const friendIds = new Set(this.friends.map(f => f.id));
    this.filteredUsersList = this.users.filter(user => !friendIds.has(user.id));
  }


  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.searchDropdownOpen = false;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement | null;
    const term = target ? target.value.trim() : '';
    this.searchTerm = term;
    const lower = term.toLowerCase();

    const friendIds = new Set(this.friends.map(f => f.id));

    this.filteredUsersList = this.users.filter((user: User) => {
      return (
        !friendIds.has(user.id) &&
        !this.selectedUsers.some(selected => selected.id === user.id) &&
        (lower === '' || user.username.toLowerCase().includes(lower))
      );
    });
}


  addUser(id: string) {
    const user = this.users.find(user => user.id === id);
    if(!user) {
      console.error("User not found:", id);
      return;
    } else {
      this.selectedUsers.push(user);
      this.searchTerm = '';
      this.filteredUsersList = [];
      this.searchDropdownOpen = false;
    }
  }

  onCheckboxChange(event: any, id: string) {
    if(event.target.checked) {
      const friend = this.friends.find(friend => friend.id === id);
      if(friend) {
        this.selectedFriends.push(friend);
      } else {
        console.warn(`Friend not found for id: ${id}`);
      }
    } else {
      this.selectedFriends = this.selectedFriends.filter((friend: User) => friend.id !== id);
    }
  }

  onSubmit() {
    console.log('Submitting invite for session:', this.sessionId);
    const validSelectedFriends = this.selectedFriends.filter(f => f && f.id);
    const validSelectedUsers = this.selectedUsers.filter(u => u && u.id);

    if(validSelectedFriends.length > 0 || validSelectedUsers.length > 0) {
      const idsToInvite = [
        ...validSelectedFriends.map(friend => friend.id),
        ...validSelectedUsers.map(user => user.id)
      ];
      console.log('Inviting:', idsToInvite);
      this.notifService.info("Invitations envoyées.");
      this.apiservice.requestGame(this.sessionId, idsToInvite).pipe(takeUntil(this.destroy$)).subscribe((gameRequests: GameRequest[]) => {
        console.log("Invitation:", gameRequests);
      });
      this.gameSessionStore.invitedUsers.next([...validSelectedFriends, ...validSelectedUsers]);
    }
    this.submit.emit(this.sessionId);
  }


  onSkip() {
    this.gameSessionStore.invitedUsers.next([]);
    this.gameSessionStore.quiz.next
    this.submit.emit(this.sessionId);
  }

  onClose() {
    this.close.emit();
    if(this.sessionId) {
      this.apiservice.deleteParticipation(this.sessionId).pipe(takeUntil(this.destroy$)).subscribe((info: string) => {
        console.log("Deleted participation:", info);
      });
    }
  }
}