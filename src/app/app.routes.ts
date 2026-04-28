import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat';
import { Resume } from './resume/resume';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', component: ChatComponent },
  { path: 'resume', component: Resume, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
