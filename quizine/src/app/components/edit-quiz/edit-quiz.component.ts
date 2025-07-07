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
      // type: 'text',
      // points: 1,
      // order: this.quiz.questions.length + 1
    });
  }

  deleteQuestion(questionId: string): void {
    this.quiz.questions = this.quiz.questions.filter(q => q.id !== questionId);
  }

  updateQuestion(question: any): void {
    const index = this.quiz.questions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      this.quiz.questions[index] = question;
    }
  }

  renameQuiz(newTitle: string): void {
    if (newTitle && newTitle.trim() !== '') {
      this.quiz.nom = newTitle.trim();
    } else {
      // Handle empty title case (e.g., show a notification)
    }
  }

  togglePrivacy(): void {
    this.quiz.private = !this.quiz.private;
  }

  addTag(tag: string): void {
    if (tag && tag.trim() !== '') {
      this.quiz.tags.push(tag.trim());
    } else {
      // Handle empty tag case (e.g., show a notification)
    }
  }

  removeTag(tag: string): void {
    this.quiz.tags = this.quiz.tags.filter(t => t !== tag);
  }


  saveQuiz(): void {
    //TODO
    // this.quizService.updateQuiz(this.quiz).then(() => {
    //   this.router.navigate(['/quiz', this.quiz.id], { replaceUrl: true });
    // }).catch(() => {
      // Handle error (e.g., show a notification)
    // });
  } 
}
