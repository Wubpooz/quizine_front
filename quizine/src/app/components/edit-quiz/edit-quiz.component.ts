import { Component } from '@angular/core';
import { Quiz } from '../../models/quizModel';
import { TagListComponent } from '../tag-list/tag-list.component';
import { EditQuizQuestionComponent } from "./edit-quiz-question/edit-quiz-question.component";
import { ButtonComponent } from "../button/button.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-edit-quiz',
  standalone: true,
  imports: [TagListComponent, EditQuizQuestionComponent, ButtonComponent, CommonModule, LayoutComponent],
  templateUrl: './edit-quiz.component.html'
})
export class EditQuizComponent {
  quiz!: Quiz;

  constructor(private route: ActivatedRoute, private router: Router, private quizService: QuizService) {}
  
  ngOnInit(): void {
    let quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.quizService.getQuizById(quizId).then((quiz: Quiz) => {
        if(quiz) {
          this.quiz = quiz;
        } else {
          this.router.navigate(['/404'], { replaceUrl: true });
        }
      }).catch(() => {
        this.router.navigate(['/404'], { replaceUrl: true });
      });
    } else {
      this.router.navigate(['/404'], { replaceUrl: true });
    }
  }
}
