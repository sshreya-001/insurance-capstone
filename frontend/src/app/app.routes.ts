import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'admin' } },
  { path: 'agent', component: AgentDashboardComponent, canActivate: [authGuard], data: { role: 'agent' } },
  { path: 'customer', component: CustomerDashboardComponent, canActivate: [authGuard], data: { role: 'customer' } },
];
