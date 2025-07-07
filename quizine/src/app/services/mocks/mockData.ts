import { User } from "../../models/userModel";
import { Quiz, HistoryQuiz, EmptyQuiz } from "../../models/quizModel";
import { Session, GameRequest } from "../../models/participationModel";

export class MockData {
  public static mockUser: User = {
    id: MockData.generateRandomString(10),
    username: 'devuser',
    picture: 'assets/images/ProfileLogo.png'
  };

  public static mockQuiz: Quiz = {
    id: MockData.generateRandomString(10),
    nom: 'Quiz de test',
    picture: null,
    private: false,
    id_creator: MockData.generateRandomString(10),
    questions: [
      {
        id: "1",
        name: 'Question de test',
        id_answer: "1",
        duration: 30,
        id_creator: MockData.generateRandomString(10),
        private: false,
        choices: [
          { id: "1", content: 'Option 1', id_question: "1" },
          { id: "2", content: 'Option 2', id_question: "1" },
          { id: "3", content: 'Option 3', id_question: "1" },
          { id: "4", content: 'Option 4', id_question: "1" }
        ]
      },
      {
        id: "2",
        name: 'Question de test 2',
        id_answer: "2",
        duration: 30,
        id_creator: MockData.generateRandomString(10),
        private: false,
        choices: [
          { id: "1", content: 'Option 1', id_question: "2" },
          { id: "2", content: 'Option 2', id_question: "2" },
          { id: "3", content: 'Option 3', id_question: "2" },
          { id: "4", content: 'Option 4', id_question: "2" }
        ]
      },
      {
        id: "3",
        name: 'Question de test 3',
        id_answer: "1",
        duration: 30,
        id_creator: MockData.generateRandomString(10),
        private: false,
        choices: [
          { id: "1", content: 'Option 1', id_question: "3" },
          { id: "2", content: 'Option 2', id_question: "3" },
          { id: "3", content: 'Option 3', id_question: "3" },
          { id: "4", content: 'Option 4', id_question: "3" }
        ]
      },
      {
        id: "4",
        name: 'Question de test 4',
        id_answer: "2",
        duration: 30,
        id_creator: MockData.generateRandomString(10),
        private: false,
        choices: [
          { id: "1", content: 'Option 1', id_question: "4" },
          { id: "2", content: 'Option 2', id_question: "4" },
          { id: "3", content: 'Option 3', id_question: "4" },
          { id: "4", content: 'Option 4', id_question: "4" }
        ]
      }
    ],
    tags: ['test'],
    createdBy: 'devuser'
  };

  public static mockQuizzes: Quiz[] = [
    this.mockQuiz,
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test 2',
      picture: null,
      private: false,
      id_creator: MockData.generateRandomString(10),
      questions: [
        {
          id: "2",
          name: 'Question de test 2',
          id_answer: "1",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "2" },
            { id: "2", content: 'Option 2', id_question: "2" },
            { id: "3", content: 'Option 3', id_question: "2" },
            { id: "4", content: 'Option 4', id_question: "2" }
          ]
        },
        {
          id: "3",
          name: 'Question de test 3',
          id_answer: "2",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "3" },
            { id: "2", content: 'Option 2', id_question: "3" },
            { id: "3", content: 'Option 3', id_question: "3" },
            { id: "4", content: 'Option 4', id_question: "3" }
          ]
        }
      ],
      tags: ['test'],
      createdBy: 'devuser'
    },
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test 3',
      picture: null,
      private: true,
      id_creator: this.mockUser.id,
      questions: [
        {
          id: "1",
          name: 'Question de test 1',
          id_answer: "1",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "1" },
            { id: "2", content: 'Option 2', id_question: "1" },
            { id: "3", content: 'Option 3', id_question: "1" },
            { id: "4", content: 'Option 4', id_question: "1" }
          ]
        },
        {
          id: "2",
          name: 'Question de test 2',
          id_answer: "2",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "2" },
            { id: "2", content: 'Option 2', id_question: "2" },
            { id: "3", content: 'Option 3', id_question: "2" },
            { id: "4", content: 'Option 4', id_question: "2" }
          ]
        },
        {
          id: "3",
          name: 'Question de test 3',
          id_answer: "1",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "3" },
            { id: "2", content: 'Option 2', id_question: "3" },
            { id: "3", content: 'Option 3', id_question: "3" },
            { id: "4", content: 'Option 4', id_question: "3" }
          ]
        }
      ],
      tags: ['test'],
      createdBy: 'devuser'
    },
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test 4',
      picture: null,
      private: false,
      id_creator: MockData.generateRandomString(10),
      questions: [
        {
          id: "1",
          name: 'Question de test 1',
          id_answer: "1",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "1" },
            { id: "2", content: 'Option 2', id_question: "1" },
            { id: "3", content: 'Option 3', id_question: "1" },
            { id: "4", content: 'Option 4', id_question: "1" }
          ]
        },
        {
          id: "2",
          name: 'Question de test 2',
          id_answer: "2",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "2" },
            { id: "2", content: 'Option 2', id_question: "2" },
            { id: "3", content: 'Option 3', id_question: "2" },
            { id: "4", content: 'Option 4', id_question: "2" }
          ]
        }
      ],
      tags: ['test'],
      createdBy: 'devuser'
    },
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test 5',
      picture: null,
      private: true,
      id_creator: this.mockUser.id,
      questions: [
        {
          id: "1",
          name: 'Question de test 1',
          id_answer: "1",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "1" },
            { id: "2", content: 'Option 2', id_question: "1" },
            { id: "3", content: 'Option 3', id_question: "1" },
            { id: "4", content: 'Option 4', id_question: "1" }
          ]
        },
        {
          id: "2",
          name: 'Question de test 2',
          id_answer: "2",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "2" },
            { id: "2", content: 'Option 2', id_question: "2" },
            { id: "3", content: 'Option 3', id_question: "2" },
            { id: "4", content: 'Option 4', id_question: "2" }
          ]
        }
      ],
      tags: ['test'],
      createdBy: 'devuser'
    },
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test 6',
      picture: null,
      private: true,
      id_creator: MockData.generateRandomString(10),
      questions: [
        {
          id: "1",
          name: 'Question de test 1',
          id_answer: "1",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "1" },
            { id: "2", content: 'Option 2', id_question: "1" },
            { id: "3", content: 'Option 3', id_question: "1" },
            { id: "4", content: 'Option 4', id_question: "1" }
          ]
        },
        {
          id: "2",
          name: 'Question de test 2',
          id_answer: "2",
          duration: 30,
          id_creator: MockData.generateRandomString(10),
          private: false,
          choices: [
            { id: "1", content: 'Option 1', id_question: "2" },
            { id: "2", content: 'Option 2', id_question: "2" }
          ]
        }
      ],
      tags: ['test'],
      createdBy: 'devuser'
    }
  ];

  public static mockHistory: HistoryQuiz[] = [
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test',
      picture: null,
      private: false,
      id_creator: MockData.generateRandomString(10)
    },
    {
      id: MockData.generateRandomString(10),
      nom: 'Quiz de test 4',
      picture: null,
      private: false,
      id_creator: MockData.generateRandomString(10)
    }
  ];

  public static mockSession: Session = {
    id: MockData.generateRandomString(10),
    id_quiz: MockData.generateRandomString(10)
  };

  public static mockGameRequestList: GameRequest[] = [
    {
      datetime: new Date().toISOString(),
      id_session: MockData.generateRandomString(10),
      id_requestor: MockData.generateRandomString(10),
      id_validator: MockData.generateRandomString(10),
      username: 'devuser'
    },
    {
      datetime: new Date().toISOString(),
      id_session: MockData.generateRandomString(10),
      id_requestor: MockData.generateRandomString(10),
      id_validator: MockData.generateRandomString(10),
      username: 'testuser'
    },
    {
      datetime: new Date().toISOString(),
      id_session: MockData.generateRandomString(10),
      id_requestor: MockData.generateRandomString(10),
      id_validator: MockData.generateRandomString(10),
      username: 'exampleuser'
    }
  ];

  public static mockFriends: User[] = [
    {
      id: MockData.generateRandomString(10),
      username: 'friend1',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'friend2',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'friend3',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'friend4',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'friend5',
      picture: 'assets/images/ProfileLogo.png'
    }
  ];

  public static mockUsers: User[] = [
    {
      id: MockData.generateRandomString(10),
      username: 'devuser',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'testuser',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'exampleuser',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'user1',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'user2',
      picture: 'assets/images/ProfileLogo.png'
    },
    {
      id: MockData.generateRandomString(10),
      username: 'user3',
      picture: 'assets/images/ProfileLogo.png'
    },
    ...this.mockFriends
  ];


  // ========== UTILITIES ==========
  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
}

