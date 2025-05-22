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
    public recentHistory: BehaviorSubject<Quiz[]|undefined> = new BehaviorSubject<Quiz[]|undefined>(undefined);;

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
        this.apiService.getUserData("raphaffou").subscribe((user: User) => {
            if(!this.currentUser){
                this.currentUser = new BehaviorSubject<User|undefined>(user);
            } else {
                //this.currentUser = new BehaviorSubject<User>(user);
                this.currentUser.next(user);
            }
            this.apiService.getQuizList(user.id).subscribe((quizzes: Quiz[]) => {
                if(!this.quizList){
                    this.quizList = new BehaviorSubject<Quiz[] |undefined>(quizzes);
                } else {
                    console.log(quizzes)
                    this.quizList.next(quizzes);

                    //this.quizList = new BehaviorSubject<Quiz[]>(quizzes);
                }
            });
            this.apiService.getRecentHistory(user.id).subscribe((quizzes: Quiz[]) => {
                if(!this.recentHistory){
                    this.recentHistory = new BehaviorSubject<Quiz[]|undefined>(quizzes);
                } else {
                    this.recentHistory.next(quizzes);
                }
            });
        });
        this.apiService.getAllUsers().subscribe((friends: User[]) => {
            //this.friends = new BehaviorSubject<User[]>(friends);
            //this.friends.next(friends);
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

        this.apiService.getQuizList(user.id).subscribe((quizzes: Quiz[]) => {
            this.updateQuizList(quizzes);
        });

        this.apiService.getRecentHistory(user.id).subscribe((quizzes: Quiz[]) => {
            this.updateRecentHistory(quizzes);
        });
    }

    updateFriends(friends: User[]) {
        this.friends = new BehaviorSubject<User[]|undefined>(friends);
        //this.friends.next(friends);
        if(!this.friends) {
            this.friends = new BehaviorSubject<User[]|undefined>(friends);
        }
        else {
            this.friends.next(friends);
        }
    }

    updateQuizList(quizList: Quiz[]) {
        this.quizList = new BehaviorSubject<Quiz[]|undefined>(quizList);
        //this.quizList.next(quizList);
        if(!this.quizList) {
            this.quizList = new BehaviorSubject<Quiz[]|undefined>(quizList);
        }
        else {
            this.quizList.next(quizList);
        }
    }
        
    updateRecentHistory(recentHistory: Quiz[]) {
        if(!this.recentHistory) {
            this.recentHistory = new BehaviorSubject<Quiz[]|undefined>(recentHistory);
        }
        else {
            this.recentHistory.next(recentHistory);
        }
    }
} 