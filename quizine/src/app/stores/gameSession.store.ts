import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { Quiz } from "../models/quizModel";

@Injectable({
    providedIn: 'root'
})
export class gameSessionStore {
    public quiz: BehaviorSubject<Quiz> = new BehaviorSubject<Quiz>({
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
                        { id: 1, questionId: 1, optionText: "Paris", isCorrect: true },
                        { id: 2, questionId: 1, optionText: "London", isCorrect: false },
                        { id: 3, questionId: 1, optionText: "Berlin", isCorrect: false },
                        { id: 4, questionId: 1, optionText: "Madrid", isCorrect: false }
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
                        { id: 7, questionId: 2, optionText: "Mars", isCorrect: false },
                        { id: 8, questionId: 2, optionText: "Saturn", isCorrect: false }
                    ],
                    correctAnswer: { id: 6, questionId: 2, optionText: "Jupiter", isCorrect: true },
                    timer: 10
                }
            ]
        });

    // public scores: BehaviorSubject<Map<User, number>> = new BehaviorSubject<Map<User, number>>(new Map());
    // public scoreList$ = this.scores.asObservable();
    public answerList: BehaviorSubject<Map<number, number>> = new BehaviorSubject<Map<number, number>>(new Map());
    public answerList$ = this.answerList.asObservable();
    public score: number = 0;

    constructor() {}

}