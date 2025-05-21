import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class AppStore {
    public currentUser!: BehaviorSubject<User>;
    public friends: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);


    constructor(private apiService: APIService
        ) {
        //TODO remove
        apiService.getUserData().subscribe((user: User) => {
            if(!this.currentUser){
                this.currentUser = new BehaviorSubject<User>(user);
            } else {
                this.currentUser.next(user);
            }
        });
        this.apiService.getFriends().subscribe((friends: User[]) => {
            this.friends.next(friends);
        });
    }

    updateUser(user: User) {
        if(!user) {
            console.error("User is null");
            return;
        }
        if (this.currentUser) {
            this.currentUser.next(user);
        } else {
            this.currentUser = new BehaviorSubject<User>(user);
        }

        this.apiService.getFriends().subscribe((friends: User[]) => {
            this.updateFriends(friends);
        });
    }

    updateFriends(friends: User[]) {
        this.friends.next(friends);
    }
} 