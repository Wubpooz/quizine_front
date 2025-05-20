import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";

@Injectable({
    providedIn: 'root'
})
export class gameSessionStore {
    public scores: BehaviorSubject<Map<User, number>> = new BehaviorSubject<Map<User, number>>(new Map());
    public scoreList$ = this.scores.asObservable();

    public score: number = 0;

    constructor() {}

}