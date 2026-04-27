import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat';
import { Resume } from './resume/resume';

export const routes: Routes = [
  {path: '', component: ChatComponent},
  {path: 'resume', component: Resume}
];
