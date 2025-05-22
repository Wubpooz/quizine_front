export interface User {
  id: number;
  username: string;
  picture: string;
}
export interface Notification {
  dateTime: string;
  idSession: number;
  idRequestor: number;
  idValidator:number;
}