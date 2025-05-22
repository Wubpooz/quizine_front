export interface Participation {
    id: number;
    id_session: number;
    id_user: number;
    datetime: string;
    score?: number;
}

export interface GameRequest {
  datetime: string;
  id_session: number;
  id_requestor: number;
  id_validator: number;
  username?: string;
}

export interface Session {
  id: number;
  id_quiz: number;
}