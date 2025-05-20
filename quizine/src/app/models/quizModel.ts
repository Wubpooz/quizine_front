import { User } from './userModel';
export interface Quiz {
  title: string;
  tags: string[];
  nbQuestions: number;
  createdBy: string;
  createdAt: string;
  link: string;
}