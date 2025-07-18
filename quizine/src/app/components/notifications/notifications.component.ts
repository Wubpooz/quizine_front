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

    this.appStore.notifications.subscribe((notifications) => {
      this.notifications = notifications || [];
    });
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
      this.appStore.removeNotificationsBySession(notif.id_session);
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