import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { TopbarComponent } from "../topbar/topbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { TagListComponent } from "../tag-list/tag-list.component";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'create-quiz',
  standalone: true,
  imports: [SidebarComponent, CommonModule, FormsModule, NavbarComponent, TagListComponent],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  quizTitle: string = '';
  quizDescription: string = '';
  quizVisibility: string = 'private';
  tags: string[] = [];
  questions: {
    text: string;
    options: { text: string; isCorrect: boolean }[];
  }[] = [
    {
      text: 'Question 1',
      options: [
        { text: 'Option 1', isCorrect: false },
        { text: 'Option 2', isCorrect: false },
        { text: 'Option 3', isCorrect: false },
        { text: 'Option 4', isCorrect: false }
      ]
    }
  ];
  
  maxLengthTitle: number = 100;
  maxLengthDescription: number = 500;
  maxLengthQuestion: number = 500;
  maxLengthOption: number = 500;

  showTagInput: boolean = false;
  showDropdown: boolean = false;
  showTitleTooltip: boolean = false;
  titleMaxLengthReached: boolean = false;
  showDescriptionTooltip: boolean = false;
  descriptionMaxLengthReached: boolean = false;
  showQuestionTooltip: boolean[] = [];
  questionMaxLengthReached: boolean[] = [];
  showOptionTooltip: boolean[][] = [];
  optionMaxLengthReached: boolean[][] = [];

  tagInput: string = '';


  constructor(private apiService: APIService, private router: Router) {}


  ngOnInit() {
    this.initializeOptionStates();
  }

  initializeOptionStates() {
    this.showOptionTooltip = this.questions.map(q =>
      q.options.map(() => false)
    );
    this.optionMaxLengthReached = this.questions.map(q =>
      q.options.map(() => false)
    );
  }

  updateOptionStates() {
    this.initializeOptionStates();
  }

  addQuestion() {
    const nextNumber = this.questions.length + 1;
    this.questions.push({
      text: `Question ${nextNumber}`,
      options: [
        { text: `Option 1`, isCorrect: false },
        { text: `Option 2`, isCorrect: false },
        { text: `Option 3`, isCorrect: false },
        { text: `Option 4`, isCorrect: false }
      ]
    });
    this.updateOptionStates();
  }

  onTitleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!this.titleMaxLengthReached) this.titleMaxLengthReached = false;
    this.titleMaxLengthReached = (input.value?.length ?? 0) >= this.maxLengthTitle;
    this.showTitleTooltip = (input.value?.length ?? 0) >= this.maxLengthTitle;
  }

  onDescriptionInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!this.descriptionMaxLengthReached) this.descriptionMaxLengthReached = false;
    this.descriptionMaxLengthReached = (input.value?.length ?? 0) >= this.maxLengthDescription;
    this.showDescriptionTooltip = (input.value?.length ?? 0) >= this.maxLengthDescription;
  }

  onQuestionInput(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
    if (!this.questionMaxLengthReached) this.questionMaxLengthReached = [];
    if (!this.questionMaxLengthReached[i]) this.questionMaxLengthReached[i] = false;
    this.questionMaxLengthReached[i] = (input.value?.length ?? 0) >= this.maxLengthQuestion;
    this.showQuestionTooltip[i] = (input.value?.length ?? 0) >= this.maxLengthQuestion;
  }

  onOptionInput(event: Event, i: number, j: number) {
    const input = event.target as HTMLInputElement;
    if (!this.optionMaxLengthReached) this.optionMaxLengthReached = [];
    if (!this.optionMaxLengthReached[i]) this.optionMaxLengthReached[i] = [];
    this.optionMaxLengthReached[i][j] = (input.value?.length ?? 0) >= this.maxLengthOption;
  }

  setCorrectOption(questionIdx: number, optionIdx: number) {
    this.questions[questionIdx].options.forEach((opt, idx) => {
      opt.isCorrect = idx === optionIdx;
    });
  }

  addTag(tag: string) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.showTagInput = false;
    }
  }

  addOption(questionIdx: number) {
    this.questions[questionIdx].options.push({ text: '', isCorrect: false });
    this.updateOptionStates();
  }

  removeOption(questionIdx: number, optionIdx: number) {
    if (this.questions[questionIdx].options.length > 2) {
      this.questions[questionIdx].options.splice(optionIdx, 1);
    }
  }

  onSubmit() {
    //TODO
    //! send JSON {Quiz details, questionList:{question:{question, options:{bonneOption, autresoptions...}}}}
    let quiz = {
      title: 'New Quiz',
      tags: ['tag1', 'tag2'],
      description: 'This is a new quiz',
      questions : this.questions,
      quizVisibility : this.quizVisibility,
    }
    console.log('Form submitted', {
      quizVisibility: this.quizVisibility,
      questions: this.questions
    });

    this.apiService.createQuiz(quiz).subscribe((quiz) => {
      console.log('Quiz created successfully', quiz);
        this.router.navigate(['/quiz-preview', quiz.id]);
    });
  }
}
