import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from "../navbar/navbar.component";
import { Notification } from '../../models/userModel';
import { ButtonComponent } from '../button/button.component';
import { GameRequest } from '../../models/participationModel';
import { APIService } from '../../services/api.service';
import { AppStore } from '../../stores/app.store';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule,SidebarComponent,NavbarComponent, ButtonComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})

export class NotificationsComponent {
  // Sample notifications data
  notifications: GameRequest[] = [];

  constructor(private apiService: APIService, private appStore: AppStore) {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

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
        })
      })
    })
     
  }
  
  // async OnInit(){
    
  // }
  getUserFromId(id:number){
    let users = this.apiService.getAllUsers().toPromise().then((usrs)=>{
            return usrs?.find((u)=>u.id === id)
    })
    return users
  }


}