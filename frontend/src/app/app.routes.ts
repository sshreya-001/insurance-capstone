import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AgentDashboardComponent } from './components/agent-dashboard/agent-dashboard.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { PoliciesComponent } from './components/policies/policies.component';
import { ClaimsComponent } from './components/claims/claims.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { AboutComponent } from './components/about/about.component';
import { PoliciesOverviewComponent } from './components/policies-overview/policies-overview.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { ContactComponent } from './components/contact/contact.component';
import { ServicesComponent } from './components/services/services.component';
import { CreatePolicyComponent } from './components/create-policy/create-policy.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'policies', component: PoliciesOverviewComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'create-policy', component: CreatePolicyComponent, canActivate: [authGuard], data: { role: 'admin' } },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard], data: { role: 'admin' } },
  { path: 'agent', component: AgentDashboardComponent, canActivate: [authGuard], data: { role: 'agent' } },
  { path: 'customer', component: CustomerDashboardComponent, canActivate: [authGuard], data: { role: 'customer' } },
  { path: 'customer/policies', component: PoliciesComponent, canActivate: [authGuard], data: { role: 'customer' } },
  { path: 'customer/claims', component: ClaimsComponent, canActivate: [authGuard], data: { role: 'customer' } },
  { path: 'customer/payments', component: PaymentsComponent, canActivate: [authGuard], data: { role: 'customer' } },
];
