import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="lux-container">
      <div class="w-[min(1100px,94vw)] grid gap-6">
        <div class="lux-card">
          <h2 class="lux-title">My Policies</h2>
          <div class="overflow-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="text-mauve-700">
                <tr>
                  <th class="py-2 pr-4">Policy</th>
                  <th class="py-2 pr-4">Status</th>
                  <th class="py-2 pr-4">Premium</th>
                  <th class="py-2 pr-4">Start</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of policies" class="border-t border-plum-900/10">
                  <td class="py-2 pr-4">{{ p?.policy?.name || p?.policyId }}</td>
                  <td class="py-2 pr-4">{{ p?.status }}</td>
                  <td class="py-2 pr-4">₹ {{ p?.premiumAmount || p?.premium }}</td>
                  <td class="py-2 pr-4">{{ p?.startDate | date:'mediumDate' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CustomerDashboardComponent {
  private http = inject(HttpClient);
  policies: any;

  ngOnInit(): void {
    this.http.get('http://localhost:5000/api/v1/user/policies').subscribe((d) => (this.policies = d));
  }
}


