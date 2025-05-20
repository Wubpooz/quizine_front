import { Routes } from '@angular/router';
import { ExploreComponent } from './components/explore/explore.component';
import { QuizDescriptionComponent } from './components/quiz-description/quiz-description.component';
import { LibraryComponent } from './components/library/library.component';

export const routes: Routes = [
    {path: "explore", component: ExploreComponent},
    {path: "quizdescription", component: QuizDescriptionComponent},
    {path: "library", component: LibraryComponent}
];
