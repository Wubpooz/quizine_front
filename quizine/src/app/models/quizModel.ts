export interface Quiz {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    questions: Question[];
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