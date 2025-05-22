import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { Question, Quiz, Option } from "../models/quizModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class gameSessionStore {
    public quiz: BehaviorSubject<Quiz | undefined> = new BehaviorSubject<Quiz | undefined>(undefined);
    public score: number = 0;
    public scores: BehaviorSubject<Map<User, number>> = new BehaviorSubject<Map<User, number>>(new Map(
        [
            [ { id: 1, username: "John Doe", picture: "" }, 1450 ],
            [ { id: 2, username: "Jane Smith", picture: "" }, 1500 ],
            [ { id: 3, username: "Alice Johnson", picture: "" }, 1200 ],
            [ { id: 4, username: "Bob Brown", picture: "" }, 1400 ],
            [ { id: 5, username: "Boby own", picture: "" }, 1100 ],
            [ { id: 6, username: "Johfb Bn", picture: "" }, 600 ]
    ])); //temp
    public answerList: BehaviorSubject<Map<number, Option>> = new BehaviorSubject<Map<number, Option>>(new Map([])); //temp


    constructor(private apiService: APIService) {
        this.updateQuiz(7); //temp
    }

    updateScore(user: User, score: number) {
        const currentScores = this.scores.getValue();
        currentScores.set(user, score);
        this.scores.next(currentScores);
    }
    addAnswer(questionId: number, answerId: number) {
        const currentAnswers = this.answerList.getValue();
        const question = this.quiz.getValue()?.questions.find((q: Question) => q.id === questionId);
        const answer = question?.choices.find((o: Option) => o.id === answerId);
        if (question && answer) {
            currentAnswers.set(questionId, answer);
        }
        this.answerList.next(currentAnswers);
    }

    updateQuiz(quizId: number) {
        this.apiService.getQuiz(quizId).subscribe((quiz: Quiz) => {
            if (!this.quiz) {
                this.quiz = new BehaviorSubject<Quiz|undefined>(quiz);
            } else {
                this.quiz.next(quiz);
            }
        });
    }

    calculateScore(): number {
        const quiz = this.quiz.getValue();
        const answers = this.answerList.getValue();
        if (!quiz) return 0;
      
        let score = 0;
      
        for (const question of quiz.questions) {
          const selectedOption = answers.get(question.id);
          const correctOption = question.choices.find((choice) => choice.id === question.id_answer);
      
          if (selectedOption && correctOption && selectedOption.id === correctOption.id) {
            score += 100; // You can adjust the score per correct answer here
          }
        }
      
        this.score = score;
        return score;
      }
      

}