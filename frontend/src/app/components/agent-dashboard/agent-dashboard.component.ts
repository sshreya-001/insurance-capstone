import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="lux-container">
      <div class="w-[min(1100px,94vw)] grid gap-6">
        <div class="lux-card">
          <h2 class="lux-title">Agent Workspace</h2>
          <p class="lux-muted">Tools for sales tracking, leads and policies will appear here.</p>
        </div>
      </div>
    </section>
  `,
})
export class AgentDashboardComponent {}


