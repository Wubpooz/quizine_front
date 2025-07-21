import { Component, Directive, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { APIService } from '../../services/api.service';
import { TagListComponent } from "../tag-list/tag-list.component";
import { LayoutComponent } from "../layout/layout.component";
import { NotificationsService } from '../../services/notifications.service';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';
import { QuestionData, Quiz } from '../../models/quizModel';
import { ButtonComponent } from '../button/button.component';


@Directive({ selector: '[tooltip]', standalone: true })
export class TooltipOnHoverDirective {
  @Input() tooltip = '';
  @HostBinding('attr.title') get title() {
    return this.tooltip;
  }
}



@Component({
  selector: 'create-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule, TagListComponent, LayoutComponent, ButtonComponent, TooltipOnHoverDirective],
  templateUrl: './create-quiz.component.html'
})
export class CreateQuizComponent {
  private destroy$ = new Subject<void>();
  @ViewChild('tagInput') tagInputRef!: ElementRef<HTMLInputElement>;
  maxLengthTitle: number = 100;
  maxLengthDescription: number = 500;
  maxLengthQuestion: number = 500;
  maxLengthOption: number = 500;

  quizTitle: string = '';
  quizDescription: string = '';
  quizVisibility: 'private' | 'public' = 'private';
  tags: string[] = [];
  tagInput: string = '';
  questions: QuestionData[] = [this.getEmptyQuestion()];

  showTagInput: boolean = false;
  showDropdown: boolean = false;
  titleStates: { showTooltip: boolean, maxLengthReached: boolean } = { showTooltip: false, maxLengthReached: false };
  descriptionStates: { showTooltip: boolean, maxLengthReached: boolean } = { showTooltip: false, maxLengthReached: false };
  questionStates: { showTooltip: boolean, maxLengthReached: boolean }[] = [];
  optionStates: { showTooltip: boolean[][], maxLengthReached: boolean[][] } = { showTooltip: [], maxLengthReached: [] };


  constructor(private apiService: APIService, private router: Router, private notifService: NotificationsService, private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.initializeOptionStates();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeOptionStates() {
    this.optionStates.showTooltip = this.questions.map((question: QuestionData) =>
      question.choices.map(() => false)
    );
    this.optionStates.maxLengthReached = this.questions.map((question: QuestionData) =>
      question.choices.map(() => false)
    );
  }

  addQuestion() {
    const nextNumber = this.questions.length + 1;
    this.questions.push(this.getEmptyQuestion());
    this.initializeOptionStates();
  }

  onTitleInput(event: Event) {
    const input = (event.target as HTMLInputElement)?.value;
    this.titleStates.maxLengthReached = this.checkMaxLength(input, this.maxLengthTitle);
    this.titleStates.showTooltip = this.titleStates.maxLengthReached;
  }

  onDescriptionInput(event: Event) {
    const input = (event.target as HTMLInputElement)?.value;
    this.descriptionStates.maxLengthReached = this.checkMaxLength(input, this.maxLengthDescription);
    this.descriptionStates.showTooltip = this.descriptionStates.maxLengthReached;
  }

  onQuestionInput(event: Event, i: number) {
    const input = (event.target as HTMLInputElement)?.value;
    this.questionStates[i].maxLengthReached = this.checkMaxLength(input, this.maxLengthQuestion);
    this.questionStates[i].showTooltip = this.questionStates[i].maxLengthReached;
  }

  onOptionInput(event: Event, i: number, j: number) {
   const input = (event.target as HTMLInputElement)?.value;
    this.optionStates.maxLengthReached[i][j] = this.checkMaxLength(input, this.maxLengthOption);
    this.optionStates.showTooltip[i][j] = this.optionStates.maxLengthReached[i][j];
  }

  toggleTagInput() {
    this.showTagInput = !this.showTagInput;
    if(this.showTagInput) {
      setTimeout(() => {
      if(this.tagInputRef) {
        this.tagInputRef.nativeElement.focus();
      }
    },30);
    }
  }

  addTag(tag: string) {
    if(tag && !this.tags.includes(tag)) {
      this.tags.push(tag);
      this.showTagInput = false;
    }
  }

  // TODO use
  // addOption(questionIdx: number) {
  //   this.questions[questionIdx].choices.push({ content: '', id: '' });
  //   this.initializeOptionStates();
  // }

  // removeOption(questionIdx: number, optionIdx: number) {
  //   if(this.questions[questionIdx].choices.length > 2) {
  //     this.questions[questionIdx].choices.splice(optionIdx, 1);
  //   }
  // }


  onSubmit() {
    try { 
      this.validateQuiz(this.quizTitle, this.quizDescription, this.tags, this.quizVisibility, this.questions);

      //Order so that first option in question is the valid one
      const orderedQuestions = this.questions.map((question: QuestionData) => {
        const newChoices = [...question.choices];
        let newValidAnswer = question.validAnswer;
        if(question.validAnswer > 0 && question.validAnswer < newChoices.length) {
          const [valid] = newChoices.splice(question.validAnswer, 1);
          newChoices.unshift(valid);
          newValidAnswer = 0;
        }
        return {...question, choices: newChoices, validAnswer: newValidAnswer};
      });

      const quiz = {
        nom: this.quizTitle,
        picture: null,
        private : this.quizVisibility === 'private',
        tags: this.tags,
        questions : orderedQuestions,
      }

      console.log(quiz);

      this.spinnerService.show('Création du quiz en cours…');
      this.apiService.createQuiz(quiz).pipe(takeUntil(this.destroy$), finalize(() => this.spinnerService.hide())).subscribe((quiz: Quiz) => {
        console.log('Quiz created successfully', quiz);
        this.notifService.success("Le quiz a bien été créé");
        this.router.navigate(['/quiz-preview', quiz.id]);
      });
    } catch(error: any) {
      console.error(error);
      this.notifService.error(error, "Erreur lors de la création du quiz");
      return;
    }
  }

  get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  private getEmptyQuestion(): QuestionData {
    return {
      name: '',
      duration: 30,
      grade: 0,
      picture: null,
      id_creator: '',
      private: false,
      tags: [],
      choices: Array(4).fill({ id: '', content: '' }),
      validAnswer: -1
    };
  }

  private checkMaxLength(input: string, max: number): boolean {
    return (input?.length ?? 0) >= max;
  }


  //TODO move to validation service and also validate all quizes from api calls
  private validateQuiz(quizTitle: string, quizDescription: string, tags: string[], quizVisibility: string, questions: QuestionData[]) {
    if(!quizTitle || typeof quizTitle !== 'string' || quizTitle.trim() === '') {
      throw new Error('Le titre du quiz est requis.');
    }
    if(quizTitle.length > this.maxLengthTitle) {
      throw new Error('Le titre du quiz doit avoir moins de ' + this.maxLengthTitle + ' caractères.');
    }

    if(!quizDescription || typeof quizDescription !== 'string' || quizDescription.trim() === '') {
      throw new Error('La description du quiz est requise.');
    }
    if(quizDescription.length > this.maxLengthDescription) {
      throw new Error('La description du quiz doit avoir moins de ' + this.maxLengthDescription + ' caractères.');
    }

    if(quizVisibility === '' || !['public', 'private'].includes(quizVisibility)) {
      throw new Error('La visibilité du quiz est requise.');
    }

    if(tags && !Array.isArray(tags)) {
      throw new Error('Les tags du quiz doivent etre un tableau de strings.');
    }

    if(!questions || !Array.isArray(questions) || questions.length === 0) {
      throw new Error('Au moins une question est requise.');
    }
    for(let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if(!question.name || typeof question.name !== 'string' || question.name.trim() === '') {
        throw new Error('Le titre de la question ' + (i + 1) + ' est requis.');
      }
      if(question.name.length > this.maxLengthQuestion) {
        throw new Error('Le titre de la question ' + (i + 1) + ' doit avoir moins de ' + this.maxLengthQuestion + ' caractères.');
      }
      if(!question.choices || !Array.isArray(question.choices) || question.choices.length === 0) {
        throw new Error('Au moins une option est requise pour la question ' + (i + 1) + '.');
      }
      for(let j = 0; j < question.choices.length; j++) {
        const option = question.choices[j];
        if(!option.content || typeof option.content !== 'string' || option.content.trim() === '') {
          throw new Error('L\'option ' + (j + 1) + ' de la question ' + (i + 1) + ' est requise.');
        }
        if(option.content.length > this.maxLengthOption) {
          throw new Error('L\'option ' + (j + 1) + ' de la question ' + (i + 1) + ' doit avoir moins de ' + this.maxLengthOption + ' caractères.');
        }
      }
      if(question.validAnswer < 0 || question.validAnswer >= question.choices.length) {
        throw new Error('La bonne option de la question ' + (i + 1) + ' est requise.');
      }
    }
  }
}
