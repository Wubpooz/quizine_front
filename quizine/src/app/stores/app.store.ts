import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";
import { Quiz } from "../models/quizModel";
import { GameRequest } from "../models/participationModel";

@Injectable({
  providedIn: 'root'
})
export class AppStore {
  private inited = false;
  public currentUser: BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>(undefined);
  public friends: BehaviorSubject<User[]|undefined> = new BehaviorSubject<User[]|undefined>(undefined); //TODO remove undefined
  public quizList: BehaviorSubject<Quiz[]|undefined> = new BehaviorSubject<Quiz[]|undefined>(undefined); //TODO remove undefined
  public recents: BehaviorSubject<Quiz[]|undefined> = new BehaviorSubject<Quiz[]|undefined>(undefined); //TODO remove undefined
  public notifications: BehaviorSubject<GameRequest[]> = new BehaviorSubject<GameRequest[]>([]);

  private existingSessions = new Set<string>();

  constructor(private apiService: APIService) {}

  init() {
    if(this.inited) {
      return
    }
    this.inited = true;
    this.apiService.getUserData().subscribe((user: User) => {
      if(!this.currentUser){
        this.currentUser = new BehaviorSubject<User|undefined>(user);
      } else {
        this.currentUser.next(user);
      }
      this.apiService.getQuizList().subscribe((quizzes: Quiz[]) => {
        if(!this.quizList){
          this.quizList = new BehaviorSubject<Quiz[] |undefined>(quizzes);
        } else {
          this.quizList.next(quizzes);
        }
      });
      this.apiService.getRecentQuizzes().subscribe((quizzes: Quiz[]) => {
        if(!this.recents) {
          this.recents = new BehaviorSubject<Quiz[]|undefined>(quizzes);
        } else {
          this.recents.next(quizzes);
        }
      });
    });
    this.apiService.getAllUsers().subscribe((friends: User[]) => {
      if(!this.friends){
        this.friends = new BehaviorSubject<User[]|undefined>(friends);
      }
      else {
        this.friends.next(friends);
      }
    });
    this.apiService.getNotifications().subscribe((notifications: GameRequest[]) => {
      if(!this.notifications) {
        this.notifications = new BehaviorSubject<GameRequest[]>(notifications);
      } else {
        this.notifications.next(notifications);
      }
    });
  }

  updateUser(user: User) {
    if(!user) {
      console.error("User is null, can't update.");
      return;
    }
    if (this.currentUser) {
      this.currentUser.next(user);
    } else {
      this.currentUser = new BehaviorSubject<User|undefined>(user);
    }

    this.apiService.getFriends().subscribe((friends: User[]) => {
      this.updateFriends(friends);
    });

    this.apiService.getQuizList().subscribe((quizzes: Quiz[]) => {
      this.updateQuizList(quizzes);
    });

    this.apiService.getRecentQuizzes().subscribe((quizzes: Quiz[]) => {
      this.updateRecents(quizzes);
    });
  }
  
  removeUser() {
    this.currentUser = new BehaviorSubject<User|undefined>(undefined);
    this.friends = new BehaviorSubject<User[]|undefined>(undefined);
    this.recents = new BehaviorSubject<Quiz[]|undefined>(undefined);
    this.quizList = new BehaviorSubject<Quiz[]|undefined>(undefined);
  }

  updateFriends(friends: User[]) {
    this.friends = new BehaviorSubject<User[]|undefined>(friends);
    if(!this.friends) {
      this.friends = new BehaviorSubject<User[]|undefined>(friends);
    }
    else {
      this.friends.next(friends);
    }
  }

  updateQuizList(quizList: Quiz[]) {
    this.quizList = new BehaviorSubject<Quiz[]|undefined>(quizList);
    if(!this.quizList) {
      this.quizList = new BehaviorSubject<Quiz[]|undefined>(quizList);
    }
    else {
      this.quizList.next(quizList);
    }
  }
        
  updateRecents(recents: Quiz[]) {
    if(!this.recents) {
      this.recents = new BehaviorSubject<Quiz[]|undefined>(recents);
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