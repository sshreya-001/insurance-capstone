import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="lux-container">
      <div class="lux-card">
        <h2 class="lux-title">Welcome to the Insurance Portal</h2>
        <p class="lux-muted mb-6">Experience a seamless way to manage policies, claims and payments.</p>
        <div class="flex gap-3">
          <a routerLink="/signup" class="lux-button">Get Started</a>
          <a routerLink="/login" class="lux-link self-center">I already have an account</a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent {}


