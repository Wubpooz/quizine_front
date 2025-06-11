import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, throwError } from "rxjs";
import { User } from "../models/userModel";
import { EmptyQuiz, HistoryQuiz, Quiz } from "../models/quizModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Participation, Session } from "../models/participationModel";
import { GameRequest } from "../models/participationModel";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class APIService {
    private endpoint = environment.apiEndpoint;
    constructor(private http: HttpClient) {}

    //TODO error handling
    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }


    //============================================================
    //=========================== API ============================
    //============================================================

    //========================= Register =========================
    login(username: string, password: string): Observable<User> {
        return this.http.post<{message: string, user:User}>(this.endpoint+"/login", {username, password}, {}).pipe(
            map((response: any) => {
                return response.user;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    signup(username: string, password: string): Observable<User> {
        return this.http.post<{message: string, user:User}>(this.endpoint+"/signup", {username, password}, {}).pipe(
            map((response: any) => {
                return response.user;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    logout(): Observable<string> {
        return this.http.post<{message: string}>(this.endpoint+"/logout", {}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }


    //========================= Create =========================
    createEmptyQuiz(emptyQuiz: EmptyQuiz): Observable<Quiz> {
        return this.http.post<{message: string}>(this.endpoint+"/createQuiz", {emptyQuiz}, {}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    //========================= Explore =========================
    exploreQuiz(): Observable<Quiz[]> {
        return this.http.get<{message: string}>(this.endpoint+"/explore", {}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(3),
            catchError(this.handleError)
        );
    }


    //========================= Friends =========================
    inviteFriend(userId: number): Observable<User> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/ask/${userId}`, {}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(this.handleError)
            // 200	Demande envoyée
            // 400	Erreur de paramètre ou déjà demandé
            // 404	Utilisateur non trouvé
            // 408	Already Amis
        );
    }

    acceptFriend(userId: number): Observable<User> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/accept/${userId}`, {}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    refuseFriend(userId: number): Observable<User> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/refuse/${userId}`, {}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }

    getFriends() : Observable<User[]> {
        return this.http.get<{message: string, friends: User[]}>(this.endpoint+'/friends', {}).pipe(
            map((response: any) => {
                console.log(response.message);
                return response.friends ? Object.values(response.friends) as User[] : [];
            }),
            retry(1),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 404) {
                    return of([]);
                }
                return this.handleError(error);
            })
        );
    }
    

    //========================= Game =========================
    requestGame(session: number, players: number[]): Observable<GameRequest[]> {
            return this.http.post<GameRequest[]>(this.endpoint+"/game/gamerequest", {session, players}, {}).pipe(
                map((response: any) => {
                    return response ? Object.values(response) as GameRequest[] : [];
                }),
                catchError(this.handleError)
                // 200	Users invited successfully, you received a game request
                // 400	No game requests created
                // 404	Error creating some game requests
                // 500	Error creating game request
            );
    }

    createSession(quizId: number) : Observable<Session[]> {
        return this.http.post<Session[]>(this.endpoint+"/game/gamerequest/"+quizId, {}).pipe(
                map((response: any) => {
                    return response ? Object.values(response) as Session[] : [];
                }),
                catchError(this.handleError)
            // 400	Invalid request Missing required fields
            // 500	Error creating game session
            // 501	Failed to create participation
            );
    }

    getSession(id:number) : Observable<Session> {
        return this.http.get<Session>(this.endpoint+"/game/session/"+id, {}).pipe(
            map((response: any) => {
                return response as Session;
            }),
            catchError(this.handleError)
        );
    }

    getNotifications() : Observable<GameRequest[]> {
        return this.http.get<GameRequest[]>(this.endpoint+"/game/myGameRequest", {}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as GameRequest[] : [];
            }),
            catchError(this.handleError)
        );
    }


    //========================= History =========================
    getHistory(): Observable<HistoryQuiz[]> {
        return this.http.get<{message: string, history: HistoryQuiz[]}>(this.endpoint+"/history", {}).pipe(
            map((response: any) => {
                console.log(response.message);
                return response.history ? Object.values(response.history) as HistoryQuiz[] : [];
            }),
            retry(1),
            catchError(this.handleError)
        );
    }


    //========================= Labels =========================
    //TODO
    //create label
    //addLabel

    //========================= Profile =========================
    getUserData() : Observable<User> {
        return this.http.get<{User: User, history: Participation[]}>(this.endpoint+"/profile", {}).pipe(
            map((response: any) => {
                return response.User;
            }),
            retry(1),
            catchError(this.handleError)
        );
    }


    //========================= Quiz =========================
    getQuiz(quizId: number): Observable<Quiz> {
        return this.http.get<any>(this.endpoint+"/quiz/"+quizId, {}).pipe(
            map((response: any) => {
                return response as Quiz;
            }),
            catchError(this.handleError)
        );
    }

    getQuizList(): Observable<Quiz[]> {
        return this.http.get<any>(this.endpoint+"/quiz", {}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as Quiz[] : [];
            }),
            catchError(this.handleError)
        );
    }

    createQuiz(quizData: any): Observable<Quiz> {
        return this.http.post<any>(this.endpoint+"/quiz/new",quizData, {}).pipe(
            map((response: any) => {
                return response as Quiz;
            }),
            catchError(this.handleError)
        );
    }

    getRecentQuizzes(): Observable<Quiz[]> {
        return this.http.get<any>(this.endpoint+"/recent", {}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as Quiz[] : [];
            }),
            catchError(this.handleError)
        );
    }

    //========================= Rate =========================
    //TODO getgrate
    addRate(quizId: number, grade: number) : Observable<number> {
        return this.http.post<{message: string, newGrade: number}>(this.endpoint+"/recent",{quizId, grade}, {}).pipe(
            map((response: any) => {
                console.log(response.message);
                return response.newGrade as number;
            }),
            catchError(this.handleError)
        );
    }

    //========================= Search =========================
    //TODO
    searchQuiz() {
        return [];
    }
    searchUser() {
        return [];
    }
    searchTag() {
        return [];
    }
    
    getAllUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.endpoint+"/search/users", {}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as User[] : [];
            }),
            retry(2),
            catchError(this.handleError)
        );
    }


    //==============================================================
    //========================= Websockets =========================
    //==============================================================
    getScoreboard() {
        return [];
    }
    sendScore() {
        return [];
    }
}