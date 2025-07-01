import { Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, throwError } from "rxjs";
import { User } from "../models/userModel";
import { EmptyQuiz, HistoryQuiz, Quiz } from "../models/quizModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Participation, Session } from "../models/participationModel";
import { GameRequest } from "../models/participationModel";
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class APIService {
    private endpoint = environment.apiEndpoint;

    readonly NOTIF_STYLE: Partial<IndividualConfig> = {
        closeButton: true,
        newestOnTop: false,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 5000,
        extendedTimeOut: 1000,
        easing: "swing"
    };

    constructor(private http: HttpClient, private toastr: ToastrService) {
        // console.log("Environment:", environment.production ? "Production" : "Development");
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            this.toastr.error('Erreur réseau. Veuillez vérifier votre connexion.', 'Erreur', this.NOTIF_STYLE);
        } else if (error.status === 400) {
            this.toastr.error('Requête invalide.', 'Erreur 400', this.NOTIF_STYLE);
        } else if (error.status === 404) {
            this.toastr.error('Ressource non trouvée.', 'Erreur 404', this.NOTIF_STYLE);
        } else if (error.status === 500) {
            this.toastr.error('Erreur serveur. Veuillez réessayer plus tard.', 'Erreur 500', this.NOTIF_STYLE);
        } else if (error.status !== 401 && error.status !== 403) {
            this.toastr.error('Erreur lors de la récupération des données. Veuillez réessayer plus tard.', `Erreur ${error.status}`, this.NOTIF_STYLE);
        }
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }


    //============================================================
    //=========================== API ============================
    //============================================================

    //========================= Register =========================
    login(username: string, password: string): Observable<User> {
        return this.http.post<{message: string, user:User}>(this.endpoint+"/login", {username, password}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 401) {
                    console.error("Login failed");
                    this.toastr.error('Utilisateur inconnu ou Identifiants incorrects. Veuillez réessayer.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Invalid credentials');
                }
                else if ((response.status !== 200 && response.status !== 204) || !response.body.user) {
                    this.toastr.error('Erreur lors de la connexion. Veuillez vérifier vos identifiants.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Login failed');
                } else {
                    return response.body.user;
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    signup(username: string, password: string): Observable<string> {
        return this.http.post<{message: string}>(this.endpoint+"/signup", {username, password}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if( response.status === 409) {
                    this.toastr.error('Ce nom d\'utilisateur est déjà pris. Veuillez en choisir un autre.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Username already exists');
                } else if (response.status !== 201) {
                    this.toastr.error('Erreur lors de l\'inscription.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Signup failed');
                } else {
                    console.log(response.body.message);
                    return response.body.message;
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    logout(): Observable<string> {
        return this.http.post<{message: string}>(this.endpoint+"/logout", {}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body.message) {
                    this.toastr.info('Vous avez été déconnecté avec succès.', 'Déconnexion', this.NOTIF_STYLE);
                    return response.body.message;
                } else {
                    this.toastr.error('Erreur lors de la déconnexion.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Logout failed');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    //========================= Create =========================
    createEmptyQuiz(emptyQuiz: EmptyQuiz): Observable<Quiz> {
        return this.http.post<any>(this.endpoint+"/createQuiz", {emptyQuiz}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body) {
                    this.toastr.success('Quiz créé avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body as Quiz;
                } else {
                    this.toastr.error('Erreur lors de la création du quiz.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la création du quiz.');
                }
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    //========================= Explore =========================
    exploreQuiz(): Observable<Quiz[]> {
        return this.http.get<{message: string}>(this.endpoint+"/explore", {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body.message) {
                    // You may want to parse response.body.message if it's not an array
                    return response.body.message;
                } else {
                    this.toastr.error('Erreur lors de l\'exploration des quiz.', 'Erreur', this.NOTIF_STYLE);
                    return [];
                }
            }),
            retry(3),
            catchError(error => this.handleError(error))
        );
    }

    //========================= Friends =========================
    inviteFriend(userId: string): Observable<string> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/ask/${userId}`, {}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body.message) {
                    this.toastr.success('Demande d\'ami envoyée avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body.message;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur');
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de l\'envoi de la demande d\'ami.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de l\'envoi de la demande d\'ami.');
                }
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    acceptFriend(userId: string): Observable<string> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/accept/${userId}`, {}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body.message) {
                    this.toastr.success('Demande d\'ami acceptée avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body.message;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur');
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de l\'acceptation de la demande d\'ami.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de l\'acceptation de la demande d\'ami.');
                }
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    refuseFriend(userId: string): Observable<string> {
        return this.http.post<{message: string}>(`${this.endpoint}/friends/refuse/${userId}`, {}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body.message) {
                    this.toastr.success('Demande d\'ami refusée avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body.message;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur');
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors du refus de la demande d\'ami.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors du refus de la demande d\'ami.');
                }
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }

    getFriends(): Observable<User[]> {
        return this.http.get<{friends: User[]}>(this.endpoint+'/friends', {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if(response.status === 200 && response.body.friends) {
                    return Object.values(response.body.friends) as User[];
                } else if (response.body?.error) {
                    this.toastr.info(response.body.error, 'Info', this.NOTIF_STYLE);
                    return [];
                } else {
                    return [];
                }
            }),
            retry(1),
            catchError(error =>  this.handleError(error))
        );
    }
    

    //========================= Game =========================
    requestGame(sessionId: string, playersIds: string[]): Observable<GameRequest[]> {
        return this.http.post<any>(this.endpoint+"/game/gamerequest", {sessionId, playersIds}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if(response.status === 200 && response.body) {
                    return Object.values(response.body) as GameRequest[];
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Aucune demande de jeu créée.', 'Erreur', this.NOTIF_STYLE);
                    return [];
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    createSession(quizId: string): Observable<string> {
        return this.http.post<any>(this.endpoint+"/game/create/session/"+quizId, {}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if(response.status === 201 && response.body) {
                    return response.body.sessionId as string;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Aucune demande de session créée.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error("Didn't create session");
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    getSession(id: string): Observable<Session> {
        return this.http.get<any>(this.endpoint+"/game/session/"+id, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if(response.status === 200 && response.body) {
                    return response.body as Session;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la récupération de la session.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la récupération de la session.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    deleteParticipation(sessionId: string): Observable<string> {
        return this.http.post<any>(this.endpoint+"/game/delete/participation/"+sessionId, {}, {}).pipe(
            map((response: any) => {
                if(response.status === 200 && response.body) {
                    console.log("Deleted participation.");
                    return response.body as string;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.warning('Erreur lors de la suppression de la session.', 'Warning', this.NOTIF_STYLE);
                    throw new Error("Didn't delete session");
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    getNotifications(): Observable<GameRequest[]> {
        return this.http.get<any>(this.endpoint+"/game/myGameRequest", {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body) {
                    return Object.values(response.body) as GameRequest[];
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    return [];
                } else {
                    return [];
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    //========================= History =========================
    getHistory(): Observable<HistoryQuiz[]> {
        return this.http.get<any>(this.endpoint+"/history", {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body.history) {
                    return Object.values(response.body.history) as HistoryQuiz[];
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    return [];
                } else {
                    return [];
                }
            }),
            retry(1),
            catchError(error => this.handleError(error))
        );
    }


    //========================= Labels =========================
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
    getQuiz(quizId: string): Observable<Quiz> {
        return this.http.get<any>(this.endpoint+"/quiz/"+quizId, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body) {
                    return response.body as Quiz;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la récupération du quiz.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la récupération du quiz.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    getQuizList(): Observable<Quiz[]> {
        return this.http.get<any>(this.endpoint+"/quiz", {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body) {
                    return Object.values(response.body) as Quiz[];
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    return [];
                } else {
                    return [];
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    getRecentQuizzes(): Observable<Quiz[]> {
    return this.http.get<any>(this.endpoint+"/recent", {withCredentials: true, observe: 'response'}).pipe(
        map((response: any) => {
            if (response.status === 200 && response.body) {
                return Object.values(response.body) as Quiz[];
            } else if (response.body?.error) {
                this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                return [];
            } else {
                return [];
            }
        }),
        catchError(error => this.handleError(error))
    );
}

    createQuiz(quizData: any): Observable<Quiz> {
        return this.http.post<any>(this.endpoint+"/quiz/new", quizData, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body) {
                    this.toastr.success('Quiz créé avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body as Quiz;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur');
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la création du quiz.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la création du quiz.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    //========================= Rate =========================
    addRate(quizId: string, grade: number): Observable<number> {
        return this.http.post<any>(this.endpoint+"/recent", {quizId, grade}, {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && typeof response.body.newGrade === 'number') {
                    return response.body.newGrade as number;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la notation.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la notation.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    getRate(){}

    //========================= Search =========================
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
        return this.http.get<any>(this.endpoint+"/search/users", {withCredentials: true, observe: 'response'}).pipe(
            map((response: any) => {
                if (response.status === 200 && response.body) {
                    return Object.values(response.body) as User[];
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    return [];
                } else {
                    return [];
                }
            }),
            retry(2),
            catchError(error => this.handleError(error))
        );
    }


    //==============================================================
    //========================== Realtime ==========================
    //==============================================================
    joinSession(sessionId: string): Observable<any> {
        return this.http.post<any>(`${this.endpoint}/session/${sessionId}/join`, {}, {withCredentials: true, observe: 'response'}).pipe(
            map(response => {
                if (response.status === 200 && response.body) {
                    this.toastr.success('Session rejointe avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la tentative de rejoindre la session.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la tentative de rejoindre la session.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    leaveSession(sessionId: string): Observable<any> {
        return this.http.post<any>(`${this.endpoint}/session/${sessionId}/leave`, {}, {withCredentials: true, observe: 'response'}).pipe(
            map(response => {
                if (response.status === 200 && response.body) {
                    this.toastr.info('Session quittée.', 'Info', this.NOTIF_STYLE);
                    return response.body;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la tentative de quitter la session.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la tentative de quitter la session.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    refuseInvite(sessionId: string): Observable<any> {
        return this.http.post<any>(`${this.endpoint}/session/${sessionId}/refuse`, {}, {withCredentials: true, observe: 'response'}).pipe(
            map(response => {
                if (response.status === 200 && response.body) {
                    this.toastr.info('Invitation refusée.', 'Info', this.NOTIF_STYLE);
                    return response.body;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors du refus de l\'invitation.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors du refus de l\'invitation.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

    submitScore(sessionId: string, score: number): Observable<any> {
        return this.http.post<any>(`${this.endpoint}/session/${sessionId}/score`, { score }, {withCredentials: true, observe: 'response'}).pipe(
            map(response => {
                if (response.status === 200 && response.body) {
                    this.toastr.success('Score soumis avec succès.', 'Succès', this.NOTIF_STYLE);
                    return response.body;
                } else if (response.body?.error) {
                    this.toastr.error(response.body.error, 'Erreur', this.NOTIF_STYLE);
                    throw new Error(response.body.error);
                } else {
                    this.toastr.error('Erreur lors de la soumission du score.', 'Erreur', this.NOTIF_STYLE);
                    throw new Error('Erreur lors de la soumission du score.');
                }
            }),
            catchError(error => this.handleError(error))
        );
    }

}