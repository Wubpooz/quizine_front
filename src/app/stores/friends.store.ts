import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";

@Injectable({
    providedIn: 'root'
})
export class FriendsStore {
  public friendListSubject = new BehaviorSubject<User[]>([]);
  friendList$ = this.friendListSubject.asObservable();

  constructor() {}

  setFriendList(friends: User[]) {
    this.friendListSubject.next(friends);
  }
}