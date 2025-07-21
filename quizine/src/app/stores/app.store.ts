import { Injectable } from "@angular/core";
import { BehaviorSubject, finalize, forkJoin } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";
import { Quiz } from "../models/quizModel";
import { GameRequest } from "../models/participationModel";
import { SpinnerService } from "../services/spinner.service";
import { hasSessionCookie } from "../utils/utils";
import { NotificationsService } from "../services/notifications.service";

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  private inited = false;
  public currentUser: BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>(undefined);
  public friends: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public quizList: BehaviorSubject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  public recents: BehaviorSubject<Quiz[]> = new BehaviorSubject<Quiz[]>([]);
  public notifications: BehaviorSubject<GameRequest[]> = new BehaviorSubject<GameRequest[]>([]);

  private existingSessions = new Set<string>();

  constructor(private apiService: APIService, private spinnerService: SpinnerService, private notifService: NotificationsService) {}

  init() {
    if(this.inited) {
      return;
    }

    this.inited = true;
    this.spinnerService.show('Chargement…');

    this.currentUser = this.currentUser || new BehaviorSubject<User | undefined>(undefined);
    this.quizList = this.quizList || new BehaviorSubject<Quiz[]>([]);
    this.recents = this.recents || new BehaviorSubject<Quiz[]>([]);
    this.friends = this.friends || new BehaviorSubject<User[]>([]);
    this.notifications = this.notifications || new BehaviorSubject<GameRequest[]>([]);

    // Check if a session cookie exists, wait 5s max with retry every 300ms
    if(!hasSessionCookie()) {
      const intervalId = setInterval(() => {
        if (!hasSessionCookie()) {
          console.error('No session cookie found');
          this.spinnerService.hide();
          this.notifService.error('Impossible de se connecter, rechargez la page.');
        } else {
          clearInterval(intervalId); // clear the interval when condition is met
        }
      }, 300);

      setTimeout(() => { clearInterval(intervalId); }, 5000);
    }

    this.apiService.getUserData().pipe(finalize(() => this.spinnerService.hide())).subscribe({
      next: (user: User) => {
        this.currentUser.next(user);
        forkJoin({
          quizList: this.apiService.getQuizList(),
          recents: this.apiService.getRecentQuizzes(),
          friends: this.apiService.getAllUsers(),
          notifications: this.apiService.getNotifications()
        }).subscribe({
          next: ({ quizList, recents, friends, notifications }) => {
            this.quizList.next(quizList);
            this.recents.next(recents);
            this.friends.next(friends);
            this.notifications.next(notifications);
          },
          error: (err) => {
            console.error('Error while fetching user-related data', err);
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch user data', err);
      }
    });
  }

  updateUser(user: User) {
    if(!user) {
      console.error("User is null, can't update.");
      return;
    }

    this.currentUser?.next(user);

    forkJoin({
      friends: this.apiService.getFriends(),
      quizList: this.apiService.getQuizList(),
      recents: this.apiService.getRecentQuizzes()
    }).subscribe({
      next: ({ friends, quizList, recents }) => {
        this.friends?.next(friends);
        this.quizList?.next(quizList);
        this.recents?.next(recents);
      },
      error: (err) => {
        console.error('Failed to update user-related data', err);
      }
    });
  }

  
  removeUser() {
    this.currentUser = new BehaviorSubject<User|undefined>(undefined);
    this.friends = new BehaviorSubject<User[]>([]);
    this.recents = new BehaviorSubject<Quiz[]>([]);
    this.quizList = new BehaviorSubject<Quiz[]>([]);
  }

  updateFriends(friends: User[]) {
    this.friends = new BehaviorSubject<User[]>(friends);
    if(!this.friends) {
      this.friends = new BehaviorSubject<User[]>(friends);
    }
    else {
      this.friends.next(friends);
    }
  }

  updateQuizList(quizList: Quiz[]) {
    this.quizList = new BehaviorSubject<Quiz[]>(quizList);
    if(!this.quizList) {
      this.quizList = new BehaviorSubject<Quiz[]>(quizList);
    }
    else {
      this.quizList.next(quizList);
    }
  }
        
  updateRecents(recents: Quiz[]) {
    if(!this.recents) {
      this.recents = new BehaviorSubject<Quiz[]>(recents);
    }
    else {
      this.recents.next(recents);
    }
  }

  updateNotifications(notifications: GameRequest[]) {
    if(!this.notifications) {
      this.notifications = new BehaviorSubject<GameRequest[]>(notifications);
    }
    else {
      this.notifications.next(notifications);
    }
  }

  addNewNotifications(notifications: GameRequest[]) {
    const existing = this.notifications.value;
    const combined = [...existing, ...notifications.filter(n => !this.existingSessions.has(n.id_session))];

    notifications.forEach(n => this.existingSessions.add(n.id_session));
    this.notifications.next(combined);
  }

  removeNotification(notification: GameRequest) {
    let notifications = this.notifications.value;
    if(notifications && notification) {    
      let i = notifications.findIndex((gameRequest) => gameRequest.datetime === notification.datetime 
              && gameRequest.id_session === notification.id_session
              && gameRequest.id_requestor === notification.id_requestor);
      notifications.splice(i, 1);
      this.notifications.next(notifications);
    }
  }

  removeNotificationsBySession(sessionId: string) {
    this.notifications.next(this.notifications.value.filter(n => n.id_session !== sessionId));
    this.existingSessions.delete(sessionId);
  }

  clearNotifications() {
    this.notifications.next([]);
    this.existingSessions.clear();
  }

} 