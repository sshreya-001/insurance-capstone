import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="lux-container">
      <div class="w-[min(1100px,94vw)] grid gap-6">
        <div class="lux-card">
          <h2 class="lux-title">Admin Overview</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="rounded-xl border border-plum-900/10 bg-white/70 backdrop-blur p-4 shadow">
              <p class="lux-muted text-sm">Users</p>
              <p class="text-3xl font-semibold">{{ summary?.users || 0 }}</p>
            </div>
            <div class="rounded-xl border border-plum-900/10 bg-white/70 backdrop-blur p-4 shadow">
              <p class="lux-muted text-sm">Policies Sold</p>
              <p class="text-3xl font-semibold">{{ summary?.policiesSold || 0 }}</p>
            </div>
            <div class="rounded-xl border border-plum-900/10 bg-white/70 backdrop-blur p-4 shadow">
              <p class="lux-muted text-sm">Active Policies</p>
              <p class="text-3xl font-semibold">{{ summary?.claimsPending || 0 }}</p>
            </div>
            <div class="rounded-xl border border-plum-900/10 bg-white/70 backdrop-blur p-4 shadow">
              <p class="lux-muted text-sm">Total Payments</p>
              <p class="text-3xl font-semibold">₹ {{ summary?.totalPayments || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="lux-card">
          <h3 class="text-xl font-semibold mb-4">Recent Audit Logs</h3>
          <div class="overflow-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-mauve-700">
                <tr>
                  <th class="py-2 pr-4">Timestamp</th>
                  <th class="py-2 pr-4">User</th>
                  <th class="py-2 pr-4">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let log of audit" class="border-t border-plum-900/10">
                  <td class="py-2 pr-4">{{ log?.timestamp | date:'short' }}</td>
                  <td class="py-2 pr-4">{{ log?.userId || '-' }}</td>
                  <td class="py-2 pr-4">{{ log?.action || log?.endpoint }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="lux-card">
          <h3 class="text-xl font-semibold mb-4">Agents</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div *ngFor="let a of agents" class="rounded-xl border border-plum-900/10 bg-white/70 backdrop-blur p-4">
              <p class="font-medium">{{ a?.name }}</p>
              <p class="lux-muted text-sm">{{ a?.email }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboardComponent {
  private http = inject(HttpClient);

  summary: any;
  audit: any;
  agents: any;

  ngOnInit(): void {
    this.http.get('http://localhost:5000/api/v1/admin/summary').subscribe((d) => (this.summary = d));
    this.http.get('http://localhost:5000/api/v1/admin/audit').subscribe((d) => (this.audit = d));
    this.http.get('http://localhost:5000/api/v1/agents').subscribe((d) => (this.agents = d));
  }
}


