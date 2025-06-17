import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { TagListComponent } from "../tag-list/tag-list.component";
import { LayoutComponent } from "../layout/layout.component";

@Component({
  selector: 'create-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, TagListComponent, LayoutComponent],
  templateUrl: './create-quiz.component.html'
})
export class CreateQuizComponent {
  @ViewChild('tagInput') tagInputRef!: ElementRef<HTMLInputElement>;

  quizTitle: string = '';
  quizDescription: string = '';
  quizVisibility: string = 'private';
  tags: string[] = [];
  questions: {
    name: string;
    grade: number;
    duration: number;
    picture: null;
    id_creator: string;
    private: boolean;
    tags: string[];
    choices: { id: string; content: string }[];
    validAnswer: number;
  }[] = [
    {
      name: '',
      grade: 0,
      duration: 30,
      picture: null,
      id_creator: "",
      private: false,
      tags: [],
      choices: [
        {id: '' ,content: ''},
        {id: '' ,content: ''},
        {id: '' ,content: ''},
        {id: '' ,content: ''}
      ],
      validAnswer: -1
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
      q.choices.map(() => false)
    );
    this.optionMaxLengthReached = this.questions.map(q =>
      q.choices.map(() => false)
    );
  }

  updateOptionStates() {
    this.initializeOptionStates();
  }

  addQuestion() {
    const nextNumber = this.questions.length + 1;
    this.questions.push({
      name: '',
      duration: 30,
      grade: 0,
      picture: null,
      id_creator: '',
      private: false,
      tags: [],
      choices: [
        {id: '' ,content: ''},
        {id: '' ,content: ''},
        {id: '' ,content: ''},
        {id: '' ,content: ''}
      ],
      validAnswer : -1
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
    this.questions[questionIdx].validAnswer = optionIdx;
  }

  toggleTagInput() {
    this.showTagInput = !this.showTagInput;
    if (this.showTagInput) {
      setTimeout(() => {
      if (this.tagInputRef) {
        this.tagInputRef.nativeElement.focus();
      }
    },30);
    }
  }

  addTag(tag: string) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.showTagInput = false;
    }
  }

  addOption(questionIdx: number) {
    this.questions[questionIdx].choices.push({ content: '', id: '' });
    this.updateOptionStates();
  }

  removeOption(questionIdx: number, optionIdx: number) {
    if (this.questions[questionIdx].choices.length > 2) {
      this.questions[questionIdx].choices.splice(optionIdx, 1);
    }
  }

  onSubmit() {
    //Order so that first option in question is the valid one
    const orderedQuestions = this.questions.map(
      (q) => {
      const newChoices = [...q.choices];
      let newValidAnswer = q.validAnswer;
      if (q.validAnswer > 0 && q.validAnswer < newChoices.length) {
        const [valid] = newChoices.splice(q.validAnswer, 1);
        newChoices.unshift(valid);
        newValidAnswer = 0;
      }
      return {
        ...q,
        choices: newChoices,
        validAnswer: newValidAnswer
      };
      }
    );
    const quiz = {
      nom: this.quizTitle,
      picture: null,
      private : this.quizVisibility === 'private' ? true : false,
      tags: this.tags,
      questions : orderedQuestions,
    }
    console.log(quiz);

    this.apiService.createQuiz(quiz).subscribe((quiz) => {
      console.log('Quiz created successfully', quiz);
      this.router.navigate(['/quiz-preview', quiz.id]);
    });
  }
}
