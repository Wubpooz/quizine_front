export interface EmptyQuiz {
  nom: string;
  picture: Uint8Array | null;
  isPrivate: boolean;
}

export interface HistoryQuiz {
  id: string;
  nom: string;
  picture: Uint8Array | null;
  private: boolean;
  id_creator: string;
}

export interface Quiz {
  id: string;
  nom: string;
  picture: Uint8Array | null;
  private: boolean;
  id_creator: string;
  questions: Question[];
  tags: string[];
  createdBy: string;
}

export interface Question {
  id: string;
  name: string;
  id_answer: string;
  grade?: number;
  picture?: Uint8Array | null;
  duration: number;
  id_creator: string;
  private: boolean;
  choices: Option[];
}

export interface QuestionData {
  name: string;
  grade?: number;
  duration: number;
  picture?: Uint8Array | null;
  id_creator: string;
  private: boolean;
  tags: string[];
  choices: OptionData[];
  validAnswer: number;
}


export interface Option {
  id: string;
  content: string;
  id_question: string;
}

export interface OptionData {
  id: string;
  content: string;
}