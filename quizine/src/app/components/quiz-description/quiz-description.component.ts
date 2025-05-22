import { Component, Input } from '@angular/core';
import { TagListComponent } from "../tag-list/tag-list.component";
import { ButtonComponent } from "../button/button.component";
import { Quiz } from '../../models/quizModel';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-quiz-description',
  standalone: true,
  imports: [TagListComponent, ButtonComponent, CommonModule, SidebarComponent],
  templateUrl: './quiz-description.component.html',
  styleUrl: './quiz-description.component.css'
})
export class QuizDescriptionComponent {
  quiz!: Quiz;

  constructor(private route: ActivatedRoute, private quizService: QuizService, private router: Router) {}

  ngOnInit(): void {
    let quizId = Number(this.route.snapshot.paramMap.get('id'));
    if (quizId) {
      this.quizService.getQuizById(quizId).then((data: Quiz) => {
        this.quiz = data;
      });
    }
  }

  startQuiz(): void {
    //TODO start quiz
    this.router.navigate(['/invite']); //TODO
  }
}
