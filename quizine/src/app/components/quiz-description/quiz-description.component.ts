import { Component, Input } from '@angular/core';
import { TagListComponent } from "../tag-list/tag-list.component";
import { ButtonComponent } from "../button/button.component";
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz-description',
  standalone: true,
  imports: [TagListComponent, ButtonComponent, CommonModule],
  templateUrl: './quiz-description.component.html',
  styleUrl: './quiz-description.component.css'
})
export class QuizDescriptionComponent {
  quiz!: Quiz;

  constructor(private route: ActivatedRoute, private quizService: QuizService) {}

  ngOnInit(): void {
    let quizId = Number(this.route.snapshot.paramMap.get('id'));
    if (quizId) {
      this.quizService.getQuizById(quizId).then((data: Quiz) => {
        this.quiz = data;
      });
    }
  }
}
