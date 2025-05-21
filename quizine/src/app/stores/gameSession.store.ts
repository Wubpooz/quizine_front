import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { Question, Quiz, Option } from "../models/quizModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class gameSessionStore {
    public quiz!: BehaviorSubject<Quiz>;
    public score: number = 0;
    public scores: BehaviorSubject<Map<User, number>> = new BehaviorSubject<Map<User, number>>(new Map(
        [
            [ { id: 1, name: "John Doe", email: "mm @mm.com", createdAt: new Date(), updatedAt: new Date() }, 1450 ],
            [ { id: 2, name: "Jane Smith", email: "mm @mm.com", createdAt: new Date(), updatedAt: new Date() }, 1500 ],
            [ { id: 3, name: "Alice Johnson", email: "mm @mm.com", createdAt: new Date(), updatedAt: new Date() }, 1200 ],
            [ { id: 4, name: "Bob Brown", email: "mm @mm.com", createdAt: new Date(), updatedAt: new Date() }, 1400 ],
            [ { id: 5, name: "Boby own", email: "mm @mm.com", createdAt: new Date(), updatedAt: new Date() }, 1100 ],
            [ { id: 6, name: "Johfb Bn", email: "mm @mm.com", createdAt: new Date(), updatedAt: new Date() }, 600 ]
    ])); //temp
    public answerList: BehaviorSubject<Map<Question, Option>> = new BehaviorSubject<Map<Question, Option>>(new Map());


    constructor(private apiService: APIService) {
        this.updateQuiz(1); //temp
    }

    updateScore(user: User, score: number) {
        const currentScores = this.scores.getValue();
        currentScores.set(user, score);
        this.scores.next(currentScores);
    }
    addAnswer(questionId: number, answerId: number) {
        const currentAnswers = this.answerList.getValue();
        const question = this.quiz.getValue().questions.find(q => q.id === questionId);
        const answer = question?.options.find(o => o.id === answerId);
        if (question && answer) {
            currentAnswers.set(question, answer);
        }
        this.answerList.next(currentAnswers);
    }

    updateQuiz(quizId: number) {
        this.apiService.getQuiz(quizId).subscribe((quiz: Quiz) => {
            if (!this.quiz) {
                this.quiz = new BehaviorSubject<Quiz>(quiz);
            } else {
                this.quiz.next(quiz);
            }
        });
    }

}