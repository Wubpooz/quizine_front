import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class FriendsStore {
  public friends: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private apiService : APIService) {
    this.apiService.getFriends().subscribe((friends: User[]) => {
      this.friends.next(friends);
    });
  }
}