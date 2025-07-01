import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/userModel";
import { Question, Quiz, Option } from "../models/quizModel";
import { APIService } from "../services/api.service";

@Injectable({
    providedIn: 'root'
})
export class GameSessionStore {
    private scorePerAnswer: number = 100;
    
    public score: number = 0;
    public sessionId: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
    public quiz: BehaviorSubject<Quiz | undefined> = new BehaviorSubject<Quiz | undefined>(undefined);
    public scores: BehaviorSubject<Map<User, number>> = new BehaviorSubject<Map<User, number>>(new Map());
    public answerList: BehaviorSubject<Map<string, Option>> = new BehaviorSubject<Map<string, Option>>(new Map());

    constructor(private apiService: APIService) {}

    updateScore(user: User, score: number) {
        const currentScores = this.scores.getValue();
        currentScores.set(user, score);
        this.scores.next(currentScores);
    }
    addAnswer(questionId: string, answerId: string) {
        const currentAnswers = this.answerList.getValue();
        const question = this.quiz.getValue()?.questions.find((q: Question) => q.id === questionId);
        const answer = question?.choices.find((o: Option) => o.id === answerId);
        if (question && answer) {
            currentAnswers.set(questionId, answer);
        }
        this.answerList.next(currentAnswers);
    }

    updateQuiz(quizId: string) {
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
            score += this.scorePerAnswer;
          }
        }
      
        this.score = score;
        return score;
      }
      

}