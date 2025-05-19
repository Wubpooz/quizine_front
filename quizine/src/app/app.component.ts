import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInviteComponent } from "./components/user-invite/user-invite.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserInviteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'quizine';
}
