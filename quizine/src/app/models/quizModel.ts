export interface Quiz {
  id: number;
  title: string;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  description: string;
  questions: Question[];
  private: boolean;
}

export interface Question {
    id: number;
    quizId: number;
    questionText: string;
    options: Option[];
    correctAnswer: Option;
    timer: number;
}

export interface Option {
    id: number;
    optionText: string;
}