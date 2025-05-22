export interface EmptyQuiz {
  nom: string;
  picture: Uint8Array | null;
  isPrivate: boolean;
}

export interface HistoryQuiz {
  id: number;
  nom: string;
  picture: Uint8Array | null;
  private: boolean;
  id_creator?: number;
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

export interface Option {
  id: number;
  content: string;
  id_question: number;
}