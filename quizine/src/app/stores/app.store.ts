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
    private inited = false;
    constructor(private apiService: APIService) {
        //TODO remove - update User is called in login component
        //peut pas faire l'initialisation ici, parce que sinon on fait des trucs
        //qui peuvent pas être calculés pour qq pas connecté
    }

    init(){
        if(this.inited){
            this.inited = true
            return
        }
        this.apiService.getUserData().subscribe((user: User) => {
            if(!this.currentUser){
                this.currentUser = new BehaviorSubject<User>(user);
            } else {
                this.currentUser = new BehaviorSubject<User>(user);
                //this.currentUser.next(user);
            }
            this.apiService.getQuizList(user.id).subscribe((quizzes: Quiz[]) => {
                if(!this.quizList){
                    this.quizList = new BehaviorSubject<Quiz[]>(quizzes);
                } else {
                    this.quizList = new BehaviorSubject<Quiz[]>(quizzes);
                }
            });
        });
        this.apiService.getFriends().subscribe((friends: User[]) => {
            this.friends = new BehaviorSubject<User[]>(friends);
            //this.friends.next(friends);
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
    }

    updateFriends(friends: User[]) {
        this.friends = new BehaviorSubject<User[]>(friends);
        //this.friends.next(friends);
    }

    updateQuizList(quizList: Quiz[]) {
        this.quizList = new BehaviorSubject<Quiz[]>(quizList);
        //this.quizList.next(quizList);
    }
} 