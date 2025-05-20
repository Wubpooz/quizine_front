import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInviteComponent } from "./components/user-invite/user-invite.component";
import { WaitingPageComponent } from "./components/waiting-page/waiting-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInviteComponent, WaitingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'quizine';
}
