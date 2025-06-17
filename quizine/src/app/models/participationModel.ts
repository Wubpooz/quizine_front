export interface Participation {
  id: string;
  id_session: string;
  id_user: string;
  datetime: string;
  score?: number;
}

export interface GameRequest {
  datetime: string;
  id_session: string;
  id_requestor: string;
  id_validator: string;
  username?: string;
}

export interface Session {
  id: string;
  id_quiz: string;
}