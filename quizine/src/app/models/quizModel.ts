export interface OldQuiz {
  id: number;
  title: string;
  //tags: string[];
  createdBy: string;
  //createdAt: Date;
  description: string;
  questions: Question[];
  private: boolean;
}

export interface Quiz {
  id:number;
  nom: string;
  picture: Uint8Array | null;
  private: boolean;
  id_creator?: number;
  questions: Question[];
  tags: string[]
  createdBy:string
}

export interface OldQuestion {
    id: number;
    quizId: number;
    questionText: string;
    options: Option[];
    correctAnswer: Option;
    timer: number;
}

export interface Question {
  id:number;
  name: string;
  id_answer: number;
  grade?: number;
  picture?: Uint8Array | null;
  duration: number;
  id_creator?: number;
  private: boolean;
  choices: Option[]
}

export interface OldOption {
    id: number;
    optionText: string;
}

export interface Option {
  id: number;
  content: string;
  id_question: number;
}