import { Component } from '@angular/core';
import { Quiz } from '../../models/quizModel';
import { TagListComponent } from '../tag-list/tag-list.component';
import { EditQuizQuestionComponent } from "./edit-quiz-question/edit-quiz-question.component";
import { ButtonComponent } from "../button/button.component";
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { LayoutComponent } from '../layout/layout.component';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'edit-quiz',
  standalone: true,
  imports: [TagListComponent, EditQuizQuestionComponent, ButtonComponent, CommonModule, LayoutComponent],
  templateUrl: './edit-quiz.component.html'
})
export class EditQuizComponent {
  quiz!: Quiz;

  constructor(private route: ActivatedRoute, private router: Router,
    private quizService: QuizService, private notifService: NotificationsService) {}
  
  ngOnInit(): void {
    let quizId = this.route.snapshot.paramMap.get('id');
    if(quizId) {
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

  addQuestion(): void {
    this.quiz.questions.push({
      id: '',
      name: '',
      choices: [
        { id: '', content: '', id_question: '' },
        { id: '', content: '', id_question: '' },
        { id: '', content: '', id_question: '' },
        { id: '', content: '', id_question: '' }
      ],
      private: false,
      id_answer: '',
      duration: 30,
      id_creator: ''
    });
  }

  deleteQuestion(questionId: string): void {
    this.quiz.questions = this.quiz.questions.filter(question => question.id !== questionId);
  }

  updateQuestion(question: any): void {
    const index = this.quiz.questions.findIndex(question => question.id === question.id);
    if(index !== -1) {
      this.quiz.questions[index] = question;
    }
  }

  renameQuiz(newTitle: string): void {
    if(newTitle && newTitle.trim() !== '') {
      this.quiz.nom = newTitle.trim();
    } else {
      this.notifService.error('Le titre du quiz doit avoir au moins un caractère.');
    }
  }

  togglePrivacy(): void {
    this.quiz.private = !this.quiz.private;
  }

  addTag(tag: string): void {
    if(tag && tag.trim() !== '') {
      this.quiz.tags.push(tag.trim());
    } else {
      this.notifService.error('Le tag doit avoir au moins un caractère.');
    }
  }

  removeTag(tag: string): void {
    this.quiz.tags = this.quiz.tags.filter(tag => tag !== tag);
  }


  saveQuiz(): void {
    //TODO
    // this.quizService.updateQuiz(this.quiz).then(() => {
    //   this.router.navigate(['/quiz', this.quiz.id], { replaceUrl: true });
    //   this.notifService.success('Quiz mis à jour.');
    // }).catch(() => {
      // this.notifService.error('Erreur lors de la mise à jour du quiz.');
    // });
  } 
}
