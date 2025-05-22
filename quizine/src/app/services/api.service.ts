import { inject, Injectable } from "@angular/core";
import { catchError, from, map, Observable, of, retry, throwError } from "rxjs";
import { User } from "../models/userModel";
import { Quiz } from "../models/quizModel";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Participation } from "../models/participationModel";


@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            console.error('An error occurred:', error.error);
        } else {
            console.error(`Backend returned code ${error.status}, body was: `, error.error);
        }
        return throwError(() => new Error('Something bad happened; please try again later.'));
    }


    //========================= Register =========================
    login(username: string, password: string): Observable<User> {
      const user: User = {
          id: 1,
          username: "Joh Doe",
          picture: "",
      };
      
      return from(this.http.post<{message:string, user:User}>("/api/login", {username, password}, {})
            .toPromise().then((payload)=>payload?.user||user))
    }

    signup(username: string, password: string): Observable<User> {
      const user: User = {
          id: 1,
          username: "Joh Doe",
          picture: ""
      };
      
      return from(this.http.post<{message:string, user:User}>("/api/signup", {username, password}, {})
            .toPromise().then((payload)=>payload?.user||user))
    }

    logout(): void {
    }


    //========================= Create =========================

    //========================= Explore =========================
    //========================= Friends =========================
    //========================= Game =========================
    //========================= History =========================
    //========================= Labels =========================
    //========================= Profile =========================
    //========================= Quiz =========================
    //========================= Rate =========================
    //========================= Recent =========================
    //========================= Search =========================

    getAllUsers(): Observable<User[]> {
        // return from(this.http.get<any>("/api/search/users", {})
        //             .toPromise().then((payload)=>Object.values(payload))) as Observable<User[]>
        return this.http.get<any>("/api/search/users", {}).pipe(
                    map((response: any) => {
                        return response ? Object.values(response) as User[] : [];
                    }),
                    retry(2),
                    catchError(this.handleError)
        );
    }

    getQuizById(id: number): Observable<any> {
        return this.getQuiz(id);
    }

    getQuizList(userId: number): Observable<Quiz[]> {

      return from(this.http.get<any>("/api/quiz", {})
            .toPromise().then((payload)=>Object.values(payload)||[])) as Observable<Quiz[]>

        // return new Observable<Quiz[]>((observer) => {
        //     const quizzes: Quiz[] = this.quizList.filter(quiz => !quiz.private || quiz.createdBy === userId.toString() || quiz.createdBy === "johndoe123");
        //     observer.next(quizzes);
        //     observer.complete();
        // });
    }

    getRecentHistory(userId: number): Observable<Quiz[]> {
        return new Observable<Quiz[]>((observer) => {
            const quizzes: Quiz[] = [{
                id: 1,
                nom: "Sample Quiz",
                picture:null,
                createdBy: "John Doe",
                questions: [],
                tags: [],
                private: false
            }]
            observer.next(quizzes);
            observer.complete();
        });
        return from(this.http.get<any>("/api/recent", {})
            .toPromise().then((payload)=>Object.values(payload)||[])) as Observable<Quiz[]>
    }

    createQuiz(quizData: any): Promise<any>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ success: true, quizId: 1 });
            }, 1000);
        });
    }
        

    search() {
        return [];
    }



    getScoreboard() {
        return [];
    }
    sendScore() {
        return [];
    }

    getQuizzes() {}
    getQuiz(id: number): Observable<Quiz> {
        
            let quiz: Quiz = {
                id: 1,
                nom: "Sample Quiz",
                picture:null,
                createdBy: "John Doe",
                questions: [
                    // {
                    //     id: 1,
                    //     quizId: 1,
                    //     questionText: "What is the capital of France?",
                    //     options: [
                    //         { id: 1, optionText: "ParisAute ex ut excepteur ipsum non consectetur reprehenderit ex elit deserunt minim. Aliquip amet anim et incididunt labore id duis anim. Tempor ad ipsum et eu qui officia occaecat pariatur adipisicing exercitation mollit exercitation incididunt." },
                    //         { id: 2, optionText: "LondonNostrud nostrud ad voluptate et magna aliquip magna est proident eiusmod ipsum. Elit laborum irure reprehenderit tempor ullamco reprehenderit. Minim irure laborum ipsum officia sit exercitation. Consectetur commodo incididunt qui consectetur amet consequat commodo velit tempor labore. Tempor voluptate adipisicing ex minim voluptate eiusmod cupidatat sit est anim aliquip." },
                    //         { id: 3, optionText: "BerlinUllamco id cillum officia consequat est cillum qui eiusmod adipisicing dolore enim occaecat. Duis nostrud elit aliqua ex. Ea excepteur duis mollit ea amet consequat dolore magna nostrud et sint do. Occaecat reprehenderit laborum deserunt magna excepteur duis deserunt sit fugiat adipisicing adipisicing magna." },
                    //         { id: 4, optionText: "MadridDo magna cupidatat dolore elit est reprehenderit laboris adipisicing ex adipisicing. Nisi nostrud officia irure nisi et consectetur voluptate aliquip cillum culpa. Cupidatat sunt laboris fugiat in ex qui eiusmod sit incididunt reprehenderit veniam est fugiat reprehenderit. Aute eu minim commodo dolor velit cupidatat ut voluptate aliqua occaecat laboris laborum dolore laborum." }
                    //     ],
                    //     correctAnswer: { id: 1, optionText: "Paris" },
                    //     timer: 10
                    // },
                    // {
                    //     id: 2,
                    //     quizId: 1,
                    //     questionText: "What is the largest planet in our solar system?",
                    //     options: [
                    //         { id: 5, optionText: "Earth" },
                    //         { id: 6, optionText: "Jupiter" },
                    //         // { id: 7, questionId: 2, optionText: "Mars", isCorrect: false },
                    //         // { id: 8, questionId: 2, optionText: "Saturn", isCorrect: false }
                    //     ],
                    //     correctAnswer: { id: 6, optionText: "Jupiter" },
                    //     timer: 10
                    // }
                ],
                tags: [],
                private: false
            };
            
        return from(this.http.get<any>("/api/quiz/"+id.toString(), {})
            .toPromise().then((payload)=>payload||quiz)) as Observable<Quiz>
    }

    getUserData(userId: string) : Observable<User> {
        const user: User = {
          id: 1,
          username: "Joh Doe",
          picture: ""
      };
      
      return from(this.http.get<{historique:Participation[], User:User}>("/api/profile", {})
            .toPromise().then((payload)=>payload?.User||user))
    }

    getFriends() : Observable<User[]> {
        return new Observable<User[]>((observer) => {
            const users: User[] = [
                {
                id: 1,
                username: "John Doe",
                picture: ""
                },
                {
                id: 2,
                username: "Jane Smith",
                picture: ""
                }
            ];
            observer.next(users);
            observer.complete();
        });
    }
}