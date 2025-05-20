import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class AppStore {
    public user: User;

    constructor(
        apiService: APIService
    ) {
    }

} 