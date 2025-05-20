import { Routes } from '@angular/router';
import { WaitingPageComponent } from './components/waiting-page/waiting-page.component';
import { UserInviteComponent } from './components/user-invite/user-invite.component';

export const routes: Routes = [
    { path: 'waiting', loadComponent: () => WaitingPageComponent },
    { path: 'invite', loadComponent: () => UserInviteComponent }
];
