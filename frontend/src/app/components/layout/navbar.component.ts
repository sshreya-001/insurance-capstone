import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-plum-900/10">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <a routerLink="/" class="font-semibold tracking-tight text-plum-900">Insurance Portal</a>
        <nav class="flex items-center gap-4 text-sm">
          <a routerLink="/" class="lux-link">Home</a>
          <a *ngIf="(auth.user$ | async)?.role === 'admin'" routerLink="/admin" class="lux-link">Admin</a>
          <a *ngIf="(auth.user$ | async)?.role === 'agent'" routerLink="/agent" class="lux-link">Agent</a>
          <a *ngIf="(auth.user$ | async)?.role === 'customer'" routerLink="/customer" class="lux-link">Customer</a>
          <ng-container *ngIf="!(auth.user$ | async); else logged">
            <a routerLink="/login" class="lux-link">Login</a>
            <a routerLink="/signup" class="lux-button-outline">Sign Up</a>
          </ng-container>
          <ng-template #logged>
            <button class="lux-button-outline" (click)="logout()">Logout</button>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  logout() { this.auth.logout(); }
}


