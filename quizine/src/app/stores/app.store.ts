import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";
import { Quiz } from "../models/quizModel";

@Injectable({
    providedIn: 'root'
})
export class AppStore {
    public currentUser!: BehaviorSubject<User>;
    public friends!: BehaviorSubject<User[]>;
    public quizList!: BehaviorSubject<Quiz[]>;
    public recentHistory!: BehaviorSubject<Quiz[]>;

    constructor(private apiService: APIService) {
        //TODO remove - update User is called in login component
        apiService.getUserData().subscribe((user: User) => {
            if(!this.currentUser){
                this.currentUser = new BehaviorSubject<User>(user);
            } else {
                this.currentUser.next(user);
            }
        });
        this.apiService.getFriends().subscribe((friends: User[]) => {
            if(!this.friends){
                this.friends = new BehaviorSubject<User[]>(friends);
            }
            else {
                this.friends.next(friends);
            }
        });
        this.apiService.getQuizList(this.currentUser.value.id).subscribe((quizzes: Quiz[]) => {
            if(!this.quizList){
                this.quizList = new BehaviorSubject<Quiz[]>(quizzes);
            } else {
                this.quizList.next(quizzes);
            }
        });
        this.apiService.getRecentHistory(this.currentUser.value.id).subscribe((quizzes: Quiz[]) => {
            if(!this.recentHistory){
                this.recentHistory = new BehaviorSubject<Quiz[]>(quizzes);
            } else {
                this.recentHistory.next(quizzes);
            }
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

        this.apiService.getQuizList(user.id).subscribe((quizzes: Quiz[]) => {
            this.updateQuizList(quizzes);
        });

        this.apiService.getRecentHistory(user.id).subscribe((quizzes: Quiz[]) => {
            this.updateRecentHistory(quizzes);
        });
    }

    updateFriends(friends: User[]) {
        if(!this.friends) {
            this.friends = new BehaviorSubject<User[]>(friends);
        }
        else {
            this.friends.next(friends);
        }
    }

    updateQuizList(quizList: Quiz[]) {
        if(!this.quizList) {
            this.quizList = new BehaviorSubject<Quiz[]>(quizList);
        }
        else {
            this.quizList.next(quizList);
        }
    }

    updateRecentHistory(recentHistory: Quiz[]) {
        if(!this.recentHistory) {
            this.recentHistory = new BehaviorSubject<Quiz[]>(recentHistory);
        }
        else {
            this.recentHistory.next(recentHistory);
        }
    }
} 