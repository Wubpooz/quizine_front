import { Routes } from '@angular/router';
import { ExploreComponent } from './components/explore/explore.component';
import { QuizDescriptionComponent } from './components/quiz-description/quiz-description.component';
import { LibraryComponent } from './components/library/library.component';
import { EditQuizComponent } from './components/edit-quiz/edit-quiz.component';
import { WaitingPageComponent } from './components/waiting-page/waiting-page.component';
import { UserInviteComponent } from './components/user-invite/user-invite.component';
import { LandingComponent } from './components/landing/landing.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuizRecapComponent } from './components/quiz-recap/quiz-recap.component';
import { QuizScoreComponent } from './components/quiz-score/quiz-score.component';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';

export const routes: Routes = [
    {path: "", redirectTo: "landing", pathMatch: "full"},
    {path: "landing", component: LandingComponent},
    {path: "login", component: LoginComponent},

    {path: "home", component: HomePageComponent},
    {path: "explore", component: ExploreComponent},
    {path: "library", component: LibraryComponent},
    {path: "profile", component: ProfileComponent},

    {path: "quiz-preview/:id", component: QuizDescriptionComponent},
    {path: "edit-quiz/:id", component: EditQuizComponent},

    {path:'quiz-question', component: QuizQuestionComponent},
    {path: "quiz-recap", component: QuizRecapComponent},
    {path: "quiz-score", component: QuizScoreComponent},

    { path: 'waiting-room', component: WaitingPageComponent },

    { path: 'invite', component: UserInviteComponent }
];