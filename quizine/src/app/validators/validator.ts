import { z } from 'zod';
import { QuestionData } from '../models/quizModel';

export const ParticipationSchema = z.object({
  id: z.string(),
  id_session: z.string(),
  id_user: z.string(),
  datetime: z.string(),
  score: z.number().optional(),
});

export const GameRequestSchema = z.object({
  datetime: z.string(),
  id_session: z.string(),
  id_requestor: z.string(),
  id_validator: z.string(),
  username: z.string().optional(),
});

export const SessionSchema = z.object({
  id: z.string(),
  id_quiz: z.string(),
});

export const EmptyQuizSchema = z.object({
  nom: z.string(),
  picture: z.instanceof(Uint8Array).nullable(),
  isPrivate: z.boolean(),
});

export const HistoryQuizSchema = z.object({
  id: z.string(),
  nom: z.string(),
  picture: z.instanceof(Uint8Array).nullable(),
  private: z.boolean(),
  id_creator: z.string(),
});

export const OptionSchema = z.object({
  id: z.string(),
  content: z.string(),
  id_question: z.string(),
});

export const OptionDataSchema = z.object({
  id: z.string(),
  content: z.string(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  name: z.string(),
  id_answer: z.string(),
  grade: z.number().optional(),
  picture: z.instanceof(Uint8Array).nullable().optional(),
  duration: z.number(),
  id_creator: z.string(),
  private: z.boolean(),
  choices: z.array(OptionSchema),
});

export const QuestionDataSchema = z.object({
  name: z.string(),
  grade: z.number().optional(),
  duration: z.number(),
  picture: z.instanceof(Uint8Array).nullable().optional(),
  id_creator: z.string(),
  private: z.boolean(),
  tags: z.array(z.string()),
  choices: z.array(OptionDataSchema),
  validAnswer: z.number(),
});

export const QuizSchema = z.object({
  id: z.string(),
  nom: z.string(),
  picture: z.instanceof(Uint8Array).nullable(),
  private: z.boolean(),
  id_creator: z.string(),
  questions: z.array(QuestionSchema),
  tags: z.array(z.string()),
  createdBy: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  picture: z.string(),
});

export const NotificationSchema = z.object({
  dateTime: z.string(),
  idSession: z.string(),
  idRequestor: z.string(),
  idValidator: z.string(),
});

export const SearchTypeSchema = z.union([
  z.literal('quiz'),
  z.literal('user'),
  z.literal('tag'),
  z.literal('all'),
]);


// export type QuizData = z.infer<typeof quizSchema>;
export const quizSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  questions: z.array(
    z.object({
      text: z.string().min(1, "La question est requise"),
      duration: z.number().min(1, "Durée invalide"),
      choices: z.array(
        z.object({
          id: z.string().min(1),
          label: z.string().min(1),
        })
      ),
      id_answer: z.string().min(1, "Réponse correcte requise")
    })
  )
});


function validateQuiz(quizTitle: string, quizDescription: string, tags: string[], quizVisibility: string, questions: QuestionData[], maxLengthTitle: number, maxLengthDescription: number, maxLengthQuestion: number, maxLengthOption: number) {
  if(!quizTitle || typeof quizTitle !== 'string' || quizTitle.trim() === '') {
    throw new Error('Le titre du quiz est requis.');
  }
  if(quizTitle.length > maxLengthTitle) {
    throw new Error('Le titre du quiz doit avoir moins de ' + maxLengthTitle + ' caractères.');
  }

  if(!quizDescription || typeof quizDescription !== 'string' || quizDescription.trim() === '') {
    throw new Error('La description du quiz est requise.');
  }
  if(quizDescription.length > maxLengthDescription) {
    throw new Error('La description du quiz doit avoir moins de ' + maxLengthDescription + ' caractères.');
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
    if(question.name.length > maxLengthQuestion) {
      throw new Error('Le titre de la question ' + (i + 1) + ' doit avoir moins de ' + maxLengthQuestion + ' caractères.');
    }
    if(!question.choices || !Array.isArray(question.choices) || question.choices.length === 0) {
      throw new Error('Au moins une option est requise pour la question ' + (i + 1) + '.');
    }
    for(let j = 0; j < question.choices.length; j++) {
      const option = question.choices[j];
      if(!option.content || typeof option.content !== 'string' || option.content.trim() === '') {
        throw new Error('L\'option ' + (j + 1) + ' de la question ' + (i + 1) + ' est requise.');
      }
      if(option.content.length > maxLengthOption) {
        throw new Error('L\'option ' + (j + 1) + ' de la question ' + (i + 1) + ' doit avoir moins de ' + maxLengthOption + ' caractères.');
      }
    }
    if(question.validAnswer < 0 || question.validAnswer >= question.choices.length) {
      throw new Error('La bonne option de la question ' + (i + 1) + ' est requise.');
    }
  }
}





// import { quizSchema } from '../validators/quiz.validator';

// submitQuiz(formData: any) {
//   const result = quizSchema.safeParse(formData);

//   if (!result.success) {
//     const fieldErrors = result.error.flatten().fieldErrors;
//     console.log(fieldErrors);
//     // Optionally show messages in UI
//     this.notifService.error("Erreur de validation");
//     return;
//   }

//   // Valid: send to backend
//   this.apiService.createQuiz(result.data).subscribe(...);
// }


// AND


// this.http.get(...).pipe(
//   map(response => {
//     const result = quizSchema.safeParse(response);
//     if (!result.success) throw new Error("Invalid server response");
//     return result.data;
//   })
// )

















// TODO forms validators

export const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type LoginForm = z.infer<typeof loginFormSchema>;


// import { Component } from '@angular/core';
// import { createFormGroup } from '@ngneat/reactive-forms';
// import { loginFormSchema } from '../validators/login.validator';

// @Component({
//   selector: 'login-form',
//   templateUrl: './login-form.component.html',
// })
// export class LoginFormComponent {
//   form = createFormGroup(loginFormSchema);

//   onSubmit() {
//     if (this.form.valid) {
//       console.log(this.form.value);
//     } else {
//       this.form.markAllAsTouched();
//     }
//   }
// }


// <!-- login-form.component.html -->
// <form [formGroup]="form" (ngSubmit)="onSubmit()">
//   <input formControlName="email" type="email" />
//   <div *ngIf="form.get('email')?.hasError('zod')">
//     {{ form.get('email')?.getError('zod') }}
//   </div>

//   <input formControlName="password" type="password" />
//   <div *ngIf="form.get('password')?.hasError('zod')">
//     {{ form.get('password')?.getError('zod') }}
//   </div>

//   <button type="submit">Login</button>
// </form>




// OR
// onSubmit() {
//   const data = this.form.value;
//   const result = quizSchema.safeParse(data);

//   if (!result.success) {
//     const errors = result.error.flatten().fieldErrors;
//     // Display in template
//     this.errors = errors;
//     return;
//   }

//   this.apiService.createQuiz(result.data).subscribe(...);
// }


// <div *ngIf="errors?.title">{{ errors.title[0] }}</div>
