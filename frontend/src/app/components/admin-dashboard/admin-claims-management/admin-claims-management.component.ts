import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Claim {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  userPolicyId: {
    _id: string;
    policyProductId: {
      title: string;
      code: string;
    };
  };
  incidentDate: string;
  description: string;
  amountClaimed: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-claims-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">Claims Management</h3>
        <div class="flex space-x-2">
          <select 
            [(ngModel)]="selectedStatus" 
            (change)="filterClaims()" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Claims</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <!-- Claims Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 font-medium">Customer</th>
                <th class="py-3 px-4 font-medium">Policy</th>
                <th class="py-3 px-4 font-medium">Amount</th>
                <th class="py-3 px-4 font-medium">Status</th>
                <th class="py-3 px-4 font-medium">Submitted</th>
                <th class="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of filteredClaims" class="border-t border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4">
                  <div>
                    <div class="font-medium text-gray-800">{{ getUserName(claim) }}</div>
                    <div class="text-gray-600 text-sm">{{ getUserEmail(claim) }}</div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div>
                    <div class="font-medium text-gray-800">{{ getPolicyName(claim) }}</div>
                    <div class="text-gray-600 text-sm">{{ getPolicyCode(claim) }}</div>
                  </div>
                </td>
                <td class="py-3 px-4 font-medium text-gray-700">{{ formatCurrency(claim.amountClaimed) }}</td>
                <td class="py-3 px-4">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        [class]="getStatusBadgeClass(claim.status)">
                    {{ claim.status }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-600">{{ claim.createdAt | date:'short' }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button 
                      (click)="viewClaimDetails(claim)" 
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View
                    </button>
                    <button 
                      *ngIf="claim.status === 'PENDING'"
                      (click)="reviewClaim(claim, 'APPROVED')" 
                      class="text-green-600 hover:text-green-700 text-sm font-medium">
                      Approve
                    </button>
                    <button 
                      *ngIf="claim.status === 'PENDING'"
                      (click)="reviewClaim(claim, 'REJECTED')" 
                      class="text-red-600 hover:text-red-700 text-sm font-medium">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Claim Details Modal -->
      <div *ngIf="selectedClaim" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700">Claim Details</h3>
          </div>
          
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-3">Customer Information</h4>
                <div class="space-y-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <p class="text-gray-900">{{ getUserName(selectedClaim) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="text-gray-900">{{ getUserEmail(selectedClaim) }}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-3">Policy Information</h4>
                <div class="space-y-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Policy</label>
                    <p class="text-gray-900">{{ getPolicyName(selectedClaim) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Policy Code</label>
                    <p class="text-gray-900">{{ getPolicyCode(selectedClaim) }}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-3">Claim Information</h4>
                <div class="space-y-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Amount Claimed</label>
                    <p class="text-gray-900">{{ formatCurrency(selectedClaim.amountClaimed) }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Incident Date</label>
                    <p class="text-gray-900">{{ selectedClaim.incidentDate | date:'mediumDate' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class]="getStatusBadgeClass(selectedClaim.status)">
                      {{ selectedClaim.status }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-3">Description</h4>
                <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ selectedClaim.description }}</p>
              </div>
            </div>

            <div *ngIf="selectedClaim.decisionNotes" class="mt-6">
              <h4 class="font-medium text-gray-800 mb-2">Decision Notes</h4>
              <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">{{ selectedClaim.decisionNotes }}</p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              (click)="closeClaimDetails()" 
              class="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium">
              Close
            </button>
            <button 
              *ngIf="selectedClaim.status === 'PENDING'"
              (click)="reviewClaim(selectedClaim, 'APPROVED')" 
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              Approve Claim
            </button>
            <button 
              *ngIf="selectedClaim.status === 'PENDING'"
              (click)="reviewClaim(selectedClaim, 'REJECTED')" 
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
              Reject Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminClaimsManagementComponent implements OnInit {
  private http = inject(HttpClient);

  claims: Claim[] = [];
  filteredClaims: Claim[] = [];
  selectedClaim: Claim | null = null;
  selectedStatus = '';

  ngOnInit(): void {
    this.loadClaims();
  }

  loadClaims(): void {
    this.http.get<Claim[]>(`${environment.apiUrl}/claims`).subscribe({
      next: (claims) => {
        this.claims = claims;
        this.filteredClaims = [...claims];
      },
      error: (error) => {
        console.error('Error loading claims:', error);
      }
    });
  }

  filterClaims(): void {
    if (this.selectedStatus) {
      this.filteredClaims = this.claims.filter(claim => claim.status === this.selectedStatus);
    } else {
      this.filteredClaims = [...this.claims];
    }
  }

  viewClaimDetails(claim: Claim): void {
    this.selectedClaim = claim;
  }

  closeClaimDetails(): void {
    this.selectedClaim = null;
  }

  reviewClaim(claim: Claim, status: 'APPROVED' | 'REJECTED'): void {
    const notes = prompt(`Enter notes for ${status.toLowerCase()}ing this claim:`);
    if (notes !== null) {
      this.http.put(`${environment.apiUrl}/claims/${claim._id}/status`, {
        status,
        notes
      }).subscribe({
        next: () => {
          claim.status = status;
          claim.decisionNotes = notes;
          this.closeClaimDetails();
        },
        error: (error) => {
          console.error('Error reviewing claim:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getPolicyName(claim: any): string {
    if (claim.userPolicyId && claim.userPolicyId.policyProductId) {
      return claim.userPolicyId.policyProductId.title || claim.userPolicyId.policyProductId.code || 'Unknown Policy';
    }
    return 'Unknown Policy';
  }

  getPolicyCode(claim: any): string {
    if (claim.userPolicyId && claim.userPolicyId.policyProductId) {
      return claim.userPolicyId.policyProductId.code || 'N/A';
    }
    return 'N/A';
  }

  getUserName(claim: any): string {
    if (claim.userId) {
      return claim.userId.name || 'Unknown User';
    }
    return 'Unknown User';
  }

  getUserEmail(claim: any): string {
    if (claim.userId) {
      return claim.userId.email || 'N/A';
    }
    return 'N/A';
  }
}
