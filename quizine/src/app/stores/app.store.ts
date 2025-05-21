import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class AppStore {
    public currentUser!: BehaviorSubject<User>;

    constructor(apiService: APIService) {
        apiService.getUserData().subscribe((user: User) => {
            if(!this.currentUser){
                this.currentUser = new BehaviorSubject<User>(user);
            } else {
                this.currentUser.next(user);
            }
        });
    }

} 