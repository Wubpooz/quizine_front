import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { TopbarComponent } from "../topbar/topbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'create-quiz',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, CommonModule, FormsModule],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
  maxLengthOption: number = 500;
  maxLengthQuestion: number = 500;
  maxLengthDescription: number = 500;
  maxLengthTitle: number = 100;
  showDropdown: boolean = false;
  quizVisibility: string = 'private';
  quizDescription: string = '';
  quizTitle: string = '';
  quizTags: string[] = [];

  showOptionTooltip: boolean[][] = [];
  showQuestionTooltip: boolean[] = [];
  questionMaxLengthReached: boolean[] = [];
  showDescriptionTooltip: boolean = false;
  showTitleTooltip: boolean = false;
  optionMaxLengthReached: boolean[][] = [];

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
    this.showTitleTooltip = (input.value?.length ?? 0) >= this.maxLengthTitle;
  }

  onDescriptionInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.showDescriptionTooltip = (input.value?.length ?? 0) >= this.maxLengthDescription;
  }

  onQuestionInput(event: Event, i: number) {
    const input = event.target as HTMLInputElement;
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
    // Handle form submission logic here
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
  }
}
