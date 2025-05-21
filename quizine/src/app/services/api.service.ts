import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "../models/userModel";
import { Quiz } from "../models/quizModel";


@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor() {}

    private quizList: Quiz[] = [
        {
          id: 1,
          title: "Quiz d'histoire",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          tags: ["histoire", "france", "europe"],
          createdBy: "johndoe123",
          createdAt: new Date("2023-11-07"),
          private: false,
          questions: [
            {
              id: 1,
              quizId: 1,
              questionText: "Quelle est la capitale de la France ?",
              options: [
                { id: 1, optionText: "Paris"},
                { id: 2, optionText: "Londres"},
                { id: 3, optionText: "Berlin"},
                { id: 4, optionText: "Madrid"}
              ],
              correctAnswer: { id: 1, optionText: "Paris"},
              timer: 30
            },
            {
              id: 2,
              quizId: 1,
              questionText: "Quel est le plus grand océan du monde ?",
              options: [
                { id: 5, optionText: "Atlantique"},
                { id: 6, optionText: "Indien"},
                { id: 7, optionText: "Arctique"},
                { id: 8, optionText: "Pacifique"}
              ],
              correctAnswer: { id: 8, optionText: "Pacifique"},
              timer: 30
            }
          ]
        },
        {
          id: 2,
          title: "Quiz de géographie",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          tags: ["géographie", "france", "europe"],
          createdBy: "janesmith456",
          createdAt: new Date("2025-03-23"),
          private: false,
          questions: [
            {
              id: 3,
              quizId: 2,
              questionText: "Quel est le plus long fleuve du monde ?",
              options: [
                { id: 9, optionText: "Nil"},
                { id: 10, optionText: "Amazonie"},
                { id: 11, optionText: "Yangtsé"},
                { id: 12, optionText: "Mississippi"}
              ],
              correctAnswer: { id: 9, optionText: "Nil"},
              timer: 30
            }
          ]
        },
        {
          id: 3,
          title: "Quiz de mathématiques",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          tags: ["mathématiques", "france", "europe"],
          createdBy: "alicejohnson",
          createdAt: new Date("2024-03-22"),
          private: false,
          questions: [
            {
              id: 4,
              quizId: 3,
              questionText: "Quelle est la racine carrée de 144 ?",
              options: [
                { id: 13, optionText: "10"},
                { id: 14, optionText: "12"},
                { id: 15, optionText: "14"},
                { id: 16, optionText: "16"}
              ],
              correctAnswer: { id: 14, optionText: "12"},
              timer: 30
            }
          ]
        },
        {
          id: 4,
          title: "Quiz de physique",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
          tags: ["physique", "france", "europe"],
          createdBy: "bobbrown1998",
          createdAt: new Date("2021-07-13"),
          private: false,
          questions: [
            {
              id: 5,
              quizId: 4,
              questionText: "Quelle est la vitesse de la lumière ?",
              options: [
                { id: 17, optionText: "300 000 km/s"},
                { id: 18, optionText: "150 000 km/s"},
                { id: 19, optionText: "450 000 km/s"},
                { id: 20, optionText: "600 000 km/s"}
              ],
              correctAnswer: { id: 17, optionText: "300 000 km/s"},
              timer: 30
            }
          ]
        }
    ];

    getQuizById(id: number): Observable<any> {
        const quiz = this.quizList.find(q => q.id === id);
        return of(quiz);
    }

    search() {
        return [];
    }

    login(username: string, password: string): Observable<User> {
        return new Observable<User>((observer) => {
            const user: User = {
                id: 1,
                name: "Joh Doe",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            observer.next(user);
            observer.complete();
        });
    }

    getScoreboard() {
        return [];
    }
    sendScore() {
        return [];
    }

    getQuizzes() {}
    getQuiz(id: number): Observable<Quiz> {
        return new Observable<Quiz>((observer) => {
            let quiz: Quiz = {
                id: 1,
                title: "Sample Quiz",
                description: "This is a sample quiz.",
                createdAt: new Date(),
                createdBy: "John Doe",
                questions: [
                    {
                        id: 1,
                        quizId: 1,
                        questionText: "What is the capital of France?",
                        options: [
                            { id: 1, optionText: "ParisAute ex ut excepteur ipsum non consectetur reprehenderit ex elit deserunt minim. Aliquip amet anim et incididunt labore id duis anim. Tempor ad ipsum et eu qui officia occaecat pariatur adipisicing exercitation mollit exercitation incididunt." },
                            { id: 2, optionText: "LondonNostrud nostrud ad voluptate et magna aliquip magna est proident eiusmod ipsum. Elit laborum irure reprehenderit tempor ullamco reprehenderit. Minim irure laborum ipsum officia sit exercitation. Consectetur commodo incididunt qui consectetur amet consequat commodo velit tempor labore. Tempor voluptate adipisicing ex minim voluptate eiusmod cupidatat sit est anim aliquip." },
                            { id: 3, optionText: "BerlinUllamco id cillum officia consequat est cillum qui eiusmod adipisicing dolore enim occaecat. Duis nostrud elit aliqua ex. Ea excepteur duis mollit ea amet consequat dolore magna nostrud et sint do. Occaecat reprehenderit laborum deserunt magna excepteur duis deserunt sit fugiat adipisicing adipisicing magna." },
                            { id: 4, optionText: "MadridDo magna cupidatat dolore elit est reprehenderit laboris adipisicing ex adipisicing. Nisi nostrud officia irure nisi et consectetur voluptate aliquip cillum culpa. Cupidatat sunt laboris fugiat in ex qui eiusmod sit incididunt reprehenderit veniam est fugiat reprehenderit. Aute eu minim commodo dolor velit cupidatat ut voluptate aliqua occaecat laboris laborum dolore laborum." }
                        ],
                        correctAnswer: { id: 1, optionText: "Paris" },
                        timer: 10
                    },
                    {
                        id: 2,
                        quizId: 1,
                        questionText: "What is the largest planet in our solar system?",
                        options: [
                            { id: 5, optionText: "Earth" },
                            { id: 6, optionText: "Jupiter" },
                            // { id: 7, questionId: 2, optionText: "Mars", isCorrect: false },
                            // { id: 8, questionId: 2, optionText: "Saturn", isCorrect: false }
                        ],
                        correctAnswer: { id: 6, optionText: "Jupiter" },
                        timer: 10
                    }
                ],
                tags: [],
                private: false
            };
            observer.next(quiz);
            observer.complete();
        });
    }

    getUserData() : Observable<User> {
        return new Observable<User>((observer) => {
            const user: User = {
                id: 1,
                name: "John Doe",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            observer.next(user);
            observer.complete();
        });
    }

    getFriends() : Observable<User[]> {
        return new Observable<User[]>((observer) => {
            const users: User[] = [
                {
                id: 1,
                name: "John Doe",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
                },
                {
                id: 2,
                name: "Jane Smith",
                email: "",
                createdAt: new Date(),
                updatedAt: new Date()
                },
            ];
            observer.next(users);
            observer.complete();
        });
    }
}