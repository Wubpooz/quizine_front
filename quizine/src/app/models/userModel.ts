export interface User {
  id: string;
  username: string;
  picture: string;
}
export interface Notification {
  dateTime: string;
  idSession: string;
  idRequestor: string;
  idValidator: string;
}