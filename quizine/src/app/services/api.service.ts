import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../models/userModel";
import { Quiz } from "../models/quizModel";


@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor() {}


    search() {
        return [];
    }

    getQuizzes() {}
    getQuiz(id: number): Observable<Quiz> {
        return new Observable<Quiz>((observer) => {
            let quiz: Quiz = {
                id: 1,
                name: "Sample Quiz",
                description: "This is a sample quiz.",
                createdAt: new Date(),
                updatedAt: new Date(),
                questions: [
                    {
                        id: 1,
                        quizId: 1,
                        questionText: "What is the capital of France?",
                        options: [
                            { id: 1, questionId: 1, optionText: "ParisAute ex ut excepteur ipsum non consectetur reprehenderit ex elit deserunt minim. Aliquip amet anim et incididunt labore id duis anim. Tempor ad ipsum et eu qui officia occaecat pariatur adipisicing exercitation mollit exercitation incididunt.", isCorrect: true },
                            { id: 2, questionId: 1, optionText: "LondonNostrud nostrud ad voluptate et magna aliquip magna est proident eiusmod ipsum. Elit laborum irure reprehenderit tempor ullamco reprehenderit. Minim irure laborum ipsum officia sit exercitation. Consectetur commodo incididunt qui consectetur amet consequat commodo velit tempor labore. Tempor voluptate adipisicing ex minim voluptate eiusmod cupidatat sit est anim aliquip.", isCorrect: false },
                            { id: 3, questionId: 1, optionText: "BerlinUllamco id cillum officia consequat est cillum qui eiusmod adipisicing dolore enim occaecat. Duis nostrud elit aliqua ex. Ea excepteur duis mollit ea amet consequat dolore magna nostrud et sint do. Occaecat reprehenderit laborum deserunt magna excepteur duis deserunt sit fugiat adipisicing adipisicing magna.", isCorrect: false },
                            { id: 4, questionId: 1, optionText: "MadridDo magna cupidatat dolore elit est reprehenderit laboris adipisicing ex adipisicing. Nisi nostrud officia irure nisi et consectetur voluptate aliquip cillum culpa. Cupidatat sunt laboris fugiat in ex qui eiusmod sit incididunt reprehenderit veniam est fugiat reprehenderit. Aute eu minim commodo dolor velit cupidatat ut voluptate aliqua occaecat laboris laborum dolore laborum.", isCorrect: false }
                        ],
                        correctAnswer: { id: 1, questionId: 1, optionText: "Paris", isCorrect: true },
                        timer: 10
                    },
                    {
                        id: 2,
                        quizId: 1,
                        questionText: "What is the largest planet in our solar system?",
                        options: [
                            { id: 5, questionId: 2, optionText: "Earth", isCorrect: false },
                            { id: 6, questionId: 2, optionText: "Jupiter", isCorrect: true },
                            // { id: 7, questionId: 2, optionText: "Mars", isCorrect: false },
                            // { id: 8, questionId: 2, optionText: "Saturn", isCorrect: false }
                        ],
                        correctAnswer: { id: 6, questionId: 2, optionText: "Jupiter", isCorrect: true },
                        timer: 10
                    }
                ]
            };
            observer.next(quiz);
            observer.complete();
        });
    }

    getUserData() : Observable<User> {
        return new Observable<User>((observer) => {
            const user: User = {
                id: 1,
                name: "John Doe",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            observer.next(user);
            observer.complete();
        });
    }

    getFriends() : Observable<User[]> {
        return new Observable<User[]>((observer) => {
            const users: User[] = [
                {
                id: 1,
                name: "John Doe",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
                },
                {
                id: 2,
                name: "Jane Smith",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
                },
            ];
            observer.next(users);
            observer.complete();
        });
    }
}