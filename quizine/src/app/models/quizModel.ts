import { User } from './userModel';
export interface Quiz {
  id: number;
  title: string;
  tags: string[];
  nbQuestions: number;
  createdBy: string;
  createdAt: string;
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
  questionId: number;
  optionText: string;
  isCorrect: boolean;
}
