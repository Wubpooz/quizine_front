import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { GameRequest } from '../../models/participationModel';
import { APIService } from '../../services/api.service';
import { WaitingPageComponent } from '../waiting-page/waiting-page.component';
import { GameSessionStore } from '../../stores/gameSession.store';
import { LayoutComponent } from "../layout/layout.component";
import { NotificationsService } from '../../services/notifications.service';
import { AppStore } from '../../stores/app.store';
import { GameConnexionService } from '../../services/gameConnexion.service';
import { User } from '../../models/userModel';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ButtonComponent, WaitingPageComponent, LayoutComponent],
  templateUrl: './notifications.component.html'
})

export class NotificationsComponent {
  notifications: GameRequest[] = [];
  isWaitingPageShowing: Map<string, boolean> = new Map<string, boolean>();
  isrefus: boolean = false;
  currentUser: User | undefined = undefined;

  constructor(private apiService: APIService,
    private gamestore: GameSessionStore,
    private appStore: AppStore,
    private gameConnexion: GameConnexionService,
    private notifService: NotificationsService) {

    this.appStore.currentUser.subscribe((user) => {
      this.currentUser = user;
    });

    this.apiService.getNotifications().subscribe((gameRequests: GameRequest[] | undefined) => {
      //TODO should remove old notifications
      if(!gameRequests) {
        this.notifications = [];
        this.isWaitingPageShowing = new Map<string, boolean>();
        return;
      }

      gameRequests.forEach((gameRequest) => {
        this.getUserFromId(gameRequest.id_requestor).then((user) => {
        this.notifications.push({
        datetime: gameRequest.datetime,
        id_session: gameRequest.id_session,
        id_requestor: gameRequest.id_requestor,
        id_validator:gameRequest.id_validator,
        username: user?.username || "inconnu"
        })
        this.isWaitingPageShowing.set(gameRequest.id_session, false);
        })
      })
    });
  }

  getUserFromId(id: string) {
    const users = this.apiService.getAllUsers().toPromise().then((users)=>{
        return users?.find((u)=>u.id === id);
    });
    return users;
  }

  accepter(notif: GameRequest) {
    this.isrefus = false;
    this.isWaitingPageShowing.set(notif.id_session, true);
    this.apiService.getSession(notif.id_session).subscribe((session) => {
      if(!session) {
        this.notifService.error("Unexepcted error. Can't accept notification.");
      } else {
        let quizId = session.id_quiz;
        this.gamestore.updateQuiz(quizId);
      }
    })
  }
  refuser(notif: GameRequest) {
    this.isrefus = true;
    if(this.currentUser) {
      //TODO does it truly remove notifs from database?
      this.gameConnexion.emitRefuse(notif.id_session, this.currentUser.id);
      this.onWaitClose(notif);
      this.notifService.info(`Invitation de ${notif.username} refusée.`);
    } else {
      this.notifService.error("Unexepcted error. Can't refuse notification.");
    }
  }

  onWaitClose(notif: GameRequest) {
    this.isWaitingPageShowing.set(notif.id_session,false);
    console.log("notification suprimée");
    let i = this.notifications.findIndex((gameRequest) => gameRequest.datetime === notif.datetime 
                && gameRequest.id_session === notif.id_session
                && gameRequest.id_requestor === notif.id_requestor);
    this.notifications.splice(i, 1);
  }

}