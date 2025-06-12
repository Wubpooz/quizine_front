import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, throwError } from "rxjs";
import { User } from "../models/userModel";
import { EmptyQuiz, HistoryQuiz, Quiz } from "../models/quizModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Participation, Session } from "../models/participationModel";
import { GameRequest } from "../models/participationModel";
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class APIService {
    private endpoint = environment.apiEndpoint;
    constructor(private http: HttpClient, private toastr: ToastrService) {
        // console.log("Environment:", environment.production ? "Production" : "Development");
    }

    //TODO error handling
    private handleError(error: HttpErrorResponse) {
        this.toastr.error('Erreur lors de la récupération des données. Veuillez réessayer plus tard.', 'Erreur');
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
        }
        if (error.status !== 401 && error.status !== 403) {
            console.error('An error occurred:', error.message);
            // Command: toastr["warning"]("lmesss", "Notif")
            // toastr.options = {
            //   "closeButton": true,
            //   "debug": false,
            //   "newestOnTop": false,
            //   "progressBar": true,
            //   "positionClass": "toast-top-right",
            //   "preventDuplicates": true,
            //   "showDuration": "300",
            //   "hideDuration": "1000",
            //   "timeOut": "5000",
            //   "extendedTimeOut": "1000",
            //   "showEasing": "swing",
            //   "hideEasing": "linear",
            //   "showMethod": "fadeIn",
            //   "hideMethod": "fadeOut"
            // }
        }
        
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }


    //============================================================
    //=========================== API ============================
    //============================================================

    //========================= Register =========================
    login(username: string, password: string): Observable<User> {
        return this.http.post<{message: string, user:User}>(this.endpoint+"/login", {username, password}, {withCredentials: true}).pipe(
            map((response: any) => {
                console.log("Login response:", response.body.message);
                return response.body.user;
            }),
            catchError(error => this.handleError(error))
        );
    }

    signup(username: string, password: string): Observable<User> {
        return this.http.post<{message: string, user:User}>(this.endpoint+"/signup", {username, password}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response.user;
            }),
            catchError(error => this.handleError(error))
        );
    }

    logout(): Observable<string> {
        return this.http.post<{message: string}>(this.endpoint+"/logout", {}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response.message;
            }),
            catchError(error => this.handleError(error))
        );
    }


    //========================= Create =========================
    createEmptyQuiz(emptyQuiz: EmptyQuiz): Observable<Quiz> {
        return this.http.post<{message: string}>(this.endpoint+"/createQuiz", {emptyQuiz}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    //========================= Explore =========================
    exploreQuiz(): Observable<Quiz[]> {
        return this.http.get<{message: string}>(this.endpoint+"/explore", {withCredentials: true}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(3),
            catchError(error => this.handleError(error))
        );
    }


    //========================= Friends =========================
    inviteFriend(userId: number): Observable<User> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/ask/${userId}`, {}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(error => this.handleError(error))
            // 200	Demande envoyée
            // 400	Erreur de paramètre ou déjà demandé
            // 404	Utilisateur non trouvé
            // 408	Already Amis
        );
    }

    acceptFriend(userId: number): Observable<User> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/accept/${userId}`, {}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    refuseFriend(userId: number): Observable<User> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/refuse/${userId}`, {}, {withCredentials: true}).pipe(
            map((response: any) => {
                return response.message;
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    getFriends() : Observable<User[]> {
        return this.http.get<{message: string, friends: User[]}>(this.endpoint+'/friends', {withCredentials: true}).pipe(
            map((response: any) => {
                if(response.message) {
                    console.log(response.message);
                }
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
            return this.http.post<GameRequest[]>(this.endpoint+"/game/gamerequest", {session, players}, {withCredentials: true}).pipe(
                map((response: any) => {
                    return response ? Object.values(response) as GameRequest[] : [];
                }),
                catchError(error => this.handleError(error))
                // 200	Users invited successfully, you received a game request
                // 400	No game requests created
                // 404	Error creating some game requests
                // 500	Error creating game request
            );
    }

    createSession(quizId: number) : Observable<Session[]> {
        return this.http.post<Session[]>(this.endpoint+"/game/gamerequest/"+quizId, {}, {withCredentials: true}).pipe(
                map((response: any) => {
                    return response ? Object.values(response) as Session[] : [];
                }),
                catchError(error => this.handleError(error))
            // 400	Invalid request Missing required fields
            // 500	Error creating game session
            // 501	Failed to create participation
            );
    }

    getSession(id:number) : Observable<Session> {
        return this.http.get<Session>(this.endpoint+"/game/session/"+id, {withCredentials: true}).pipe(
            map((response: any) => {
                return response as Session;
            }),
            catchError(error => this.handleError(error))
        );
    }

    getNotifications() : Observable<GameRequest[]> {
        return this.http.get<GameRequest[]>(this.endpoint+"/game/myGameRequest", {withCredentials: true}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as GameRequest[] : [];
            }),
            catchError(error => this.handleError(error))
        );
    }


    //========================= History =========================
    getHistory(): Observable<HistoryQuiz[]> {
        return this.http.get<{message: string, history: HistoryQuiz[]}>(this.endpoint+"/history", {withCredentials: true}).pipe(
            map((response: any) => {
                console.log(response.message);
                return response.history ? Object.values(response.history) as HistoryQuiz[] : [];
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }


    //========================= Labels =========================
    //TODO
    //create label
    //addLabel

    //========================= Profile =========================
    getUserData() : Observable<User> {
        return this.http.get<{User: User, history: Participation[]}>(this.endpoint+"/profile", {withCredentials: true}).pipe(
            map((response: any) => {
                return response.User;
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }


    //========================= Quiz =========================
    getQuiz(quizId: number): Observable<Quiz> {
        return this.http.get<any>(this.endpoint+"/quiz/"+quizId, {withCredentials: true}).pipe(
            map((response: any) => {
                return response as Quiz;
            }),
            catchError(error => this.handleError(error))
        );
    }

    getQuizList(): Observable<Quiz[]> {
        return this.http.get<any>(this.endpoint+"/quiz", {withCredentials: true}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as Quiz[] : [];
            }),
            catchError(error => this.handleError(error))
        );
    }

    createQuiz(quizData: any): Observable<Quiz> {
        return this.http.post<any>(this.endpoint+"/quiz/new",quizData, {withCredentials: true}).pipe(
            map((response: any) => {
                return response as Quiz;
            }),
            catchError(error => this.handleError(error))
        );
    }

    getRecentQuizzes(): Observable<Quiz[]> {
        return this.http.get<any>(this.endpoint+"/recent", {withCredentials: true}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as Quiz[] : [];
            }),
            catchError(error => this.handleError(error))
        );
    }

    //========================= Rate =========================
    //TODO getgrate
    addRate(quizId: number, grade: number) : Observable<number> {
        return this.http.post<{message: string, newGrade: number}>(this.endpoint+"/recent",{quizId, grade}, {withCredentials: true}).pipe(
            map((response: any) => {
                console.log(response.message);
                return response.newGrade as number;
            }),
            catchError(error => this.handleError(error))
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
        return this.http.get<User[]>(this.endpoint+"/search/users", {withCredentials: true}).pipe(
            map((response: any) => {
                return response ? Object.values(response) as User[] : [];
            }),
            retry(2),
            catchError(error => this.handleError(error))
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