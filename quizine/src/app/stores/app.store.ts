import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";
import { Quiz } from "../models/quizModel";

@Injectable({
    providedIn: 'root'
})
export class AppStore {
    public currentUser: BehaviorSubject<User|undefined> = new BehaviorSubject<User|undefined>(undefined);
    public friends: BehaviorSubject<User[]|undefined> = new BehaviorSubject<User[]|undefined>(undefined);;
    public quizList: BehaviorSubject<Quiz[]|undefined> = new BehaviorSubject<Quiz[]|undefined>(undefined);;
    private inited = false;
    public recents: BehaviorSubject<Quiz[]|undefined> = new BehaviorSubject<Quiz[]|undefined>(undefined);;

    constructor(private apiService: APIService) {}

    init() {
        if(this.inited){
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
                if(!this.recents){
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
        
            
        
    }

    updateUser(user: User) {
        if(!user) {
            console.error("User is null");
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

    updateFriends(friends: User[]) {
        // this.friends = new BehaviorSubject<User[]|undefined>(friends);
        // if(!this.friends) {
        //     this.friends = new BehaviorSubject<User[]|undefined>(friends);
        // }
        // else {
        //     this.friends.next(friends);
        // }
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
} 