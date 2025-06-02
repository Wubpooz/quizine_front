import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { GameRequest } from '../../models/participationModel';
import { APIService } from '../../services/api.service';
import { WaitingPageComponent } from '../waiting-page/waiting-page.component';
import { gameSessionStore } from '../../stores/gameSession.store';
import { LayoutComponent } from "../layout/layout.component";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ButtonComponent, WaitingPageComponent, LayoutComponent],
  templateUrl: './notifications.component.html'
})

export class NotificationsComponent {
  notifications: GameRequest[] = [];
  isWaitingPageShowing:boolean[] = [];
  isrefus:boolean = false;


  constructor(private apiService: APIService,
    private gamestore:gameSessionStore) {

    this.apiService.getNotifications().toPromise().then((grs:GameRequest[]|undefined)=>{
      if(!grs){
        return
      }

      grs.forEach((gr)=>{
        this.getUserFromId(gr.id_requestor).then((u)=>{
        this.notifications.push({
        datetime: gr.datetime,
        id_session: gr.id_session,
        id_requestor: gr.id_requestor,
        id_validator:gr.id_validator,
        username: u?.username || "inconnu"
        })
        this.isWaitingPageShowing[gr.id_session] = false;
        })
      })
    })
     
  }

  getUserFromId(id:number){
    let users = this.apiService.getAllUsers().toPromise().then((usrs)=>{
            return usrs?.find((u)=>u.id === id)
    })
    return users;
  }

  async accepter(notif:GameRequest){
    this.isrefus = false;
    this.isWaitingPageShowing[notif.id_session] = true;
    let s = await this.apiService.getSession(notif.id_session).toPromise()
    let quizId = s?.id_quiz;
    this.gamestore.updateQuiz(quizId||7);
  }
  refuser(notif:GameRequest){
    this.isrefus = true;
    this.isWaitingPageShowing[notif.id_session] = true;
    //this.isWaitingPageShowing[notif.id_session] = undefined;
  }

  onWaitClose(notif:GameRequest){
    this.isWaitingPageShowing[notif.id_session] = false
    console.log("notification suprimée");
    let i = this.notifications.findIndex((gr)=>gr.datetime === notif.datetime 
                              && gr.id_session === notif.id_session
                              && gr.id_requestor === notif.id_requestor);
    this.notifications.splice(i, 1);
  }

}