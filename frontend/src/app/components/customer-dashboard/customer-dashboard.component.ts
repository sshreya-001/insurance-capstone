import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PolicyService } from '../../services/policy.service';
import { PaymentService } from '../../services/payment.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div class="w-[min(1200px,95vw)] mx-auto px-4">
        
        <!-- Enhanced Header Section -->
        <div class="mb-12">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  Welcome to Your Dashboard
                </h1>
                <p class="text-gray-600 text-xl font-light">Manage your insurance policies, payments, and claims in one place</p>
              </div>
              <div class="hidden lg:block">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Policies</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{{ policies.length }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Active Policies</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{{ getActivePoliciesCount() }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Premium</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{{ formatCurrency(getTotalPremium()) }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div class="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Pending Claims</p>
                  <p class="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{{ getPendingClaimsCount() }}</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a routerLink="/customer/policies" class="flex items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
              <div class="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">Browse Policies</p>
                <p class="text-sm text-gray-600">Explore new insurance options</p>
              </div>
            </a>

            <a routerLink="/customer/payments" class="flex items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
              <div class="p-2 bg-green-500 rounded-lg group-hover:bg-green-600 transition-colors">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">Make Payment</p>
                <p class="text-sm text-gray-600">Pay your policy premiums</p>
              </div>
            </a>

            <a routerLink="/customer/claims" class="flex items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
              <div class="p-2 bg-purple-500 rounded-lg group-hover:bg-purple-600 transition-colors">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="font-medium text-gray-900">File Claim</p>
                <p class="text-sm text-gray-600">Submit a new insurance claim</p>
              </div>
            </a>
          </div>
        </div>

        <!-- Policies Section -->
        <div class="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 class="text-2xl font-bold text-gray-800">My Policies</h2>
            <p class="text-gray-600 mt-1">Manage your insurance policies and view payment status</p>
          </div>
          
          <!-- Loading State -->
          <div *ngIf="loading" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600 text-lg">Loading your policies...</p>
          </div>
          
          <!-- Error State -->
          <div *ngIf="error && !loading" class="text-center py-12">
            <div class="text-red-500 mb-4">
              <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">{{ error }}</h3>
            <button (click)="loadDashboardData()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              Try Again
            </button>
          </div>
          
          <!-- Empty State -->
          <div *ngIf="!loading && !error && policies.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">No policies found</h3>
            <p class="text-gray-500 mb-6">You don't have any insurance policies yet. Start by exploring our available policies.</p>
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <a routerLink="/customer/policies" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                Browse Policies
              </a>
              <a routerLink="/customer/payments" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
                Make Payment
              </a>
            </div>
          </div>
          
          <!-- Policies Grid -->
          <div *ngIf="!loading && !error && policies.length > 0" class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div *ngFor="let policy of policies" class="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <!-- Policy Header -->
                <div class="flex justify-between items-start mb-4">
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 mb-1">
                      {{ policy?.policyProductId?.title || 'Unknown Policy' }}
                    </h3>
                    <p class="text-gray-600 text-sm">{{ policy?.policyProductId?.code || 'N/A' }}</p>
                  </div>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                        [class]="getStatusBadgeClass(policy?.status)">
                    {{ policy?.status }}
                  </span>
                </div>

                <!-- Policy Details -->
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600">Premium Amount</p>
                    <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(policy?.premiumPaid || 0) }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Start Date</p>
                    <p class="text-lg font-semibold text-gray-900">{{ policy?.startDate | date:'MMM dd, yyyy' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">End Date</p>
                    <p class="text-lg font-semibold text-gray-900">{{ policy?.endDate | date:'MMM dd, yyyy' }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Payment Status</p>
                    <p class="text-lg font-semibold" [class]="getPaymentStatusClass(policy?._id)">
                      {{ getPaymentStatus(policy?._id) }}
                    </p>
                  </div>
                </div>

                <!-- Agent Information -->
                <div class="mb-4 p-3 bg-white rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-600 mb-2">Assigned Agent</p>
                  <div *ngIf="policy?.assignedAgentId" class="flex items-center">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="font-medium text-gray-900">{{ policy.assignedAgentId.name }}</p>
                      <p class="text-sm text-gray-600">{{ policy.assignedAgentId.email }}</p>
                    </div>
                  </div>
                  <div *ngIf="!policy?.assignedAgentId" class="text-gray-500 text-sm">
                    <span *ngIf="policy?.status === 'PENDING_AGENT'">Awaiting agent assignment</span>
                    <span *ngIf="policy?.status !== 'PENDING_AGENT'">No agent assigned</span>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-2">
                  <button (click)="viewPolicyDetails(policy)" 
                          class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    View Details
                  </button>
                  <button (click)="makePaymentForPolicy(policy)" 
                          class="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Make Payment
                  </button>
                  <button (click)="fileClaimForPolicy(policy)" 
                          class="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    File Claim
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Policy Details Modal -->
      <div *ngIf="selectedPolicy" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-xl font-bold text-gray-900">Policy Details</h3>
            <button (click)="closePolicyDetails()" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Policy Information</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Policy Name:</span>
                    <span class="font-medium">{{ selectedPolicy?.policyProductId?.title }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Policy Code:</span>
                    <span class="font-medium">{{ selectedPolicy?.policyProductId?.code }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Status:</span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                          [class]="getStatusBadgeClass(selectedPolicy?.status)">
                      {{ selectedPolicy?.status }}
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Premium:</span>
                    <span class="font-medium">{{ formatCurrency(selectedPolicy?.premiumPaid || 0) }}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="font-semibold text-gray-900 mb-3">Coverage Period</h4>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Start Date:</span>
                    <span class="font-medium">{{ selectedPolicy?.startDate | date:'fullDate' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">End Date:</span>
                    <span class="font-medium">{{ selectedPolicy?.endDate | date:'fullDate' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Duration:</span>
                    <span class="font-medium">{{ getPolicyDuration(selectedPolicy) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div *ngIf="selectedPolicy?.nominee" class="mt-6">
              <h4 class="font-semibold text-gray-900 mb-3">Nominee Information</h4>
              <div class="bg-gray-50 p-4 rounded-lg">
                <div class="flex justify-between">
                  <span class="text-gray-600">Name:</span>
                  <span class="font-medium">{{ selectedPolicy.nominee.name }}</span>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="text-gray-600">Relation:</span>
                  <span class="font-medium">{{ selectedPolicy.nominee.relation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CustomerDashboardComponent implements OnInit {
  private policyService = inject(PolicyService);
  private paymentService = inject(PaymentService);
  private http = inject(HttpClient);
  
  policies: any[] = [];
  payments: any[] = [];
  claims: any[] = [];
  selectedPolicy: any = null;
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;
    
    // Load policies
    this.policyService.getMyPolicies().subscribe({
      next: (data) => {
        this.policies = data || [];
        this.loadPayments();
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        this.error = 'Failed to load policies. Please try again.';
        this.loading = false;
      }
    });
  }

  loadPayments(): void {
    this.paymentService.getMyPayments().subscribe({
      next: (data) => {
        this.payments = data || [];
        this.loadClaims();
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loadClaims(); // Continue even if payments fail
      }
    });
  }

  loadClaims(): void {
    this.http.get<any[]>(`${environment.apiUrl}/claims`).subscribe({
      next: (data) => {
        this.claims = data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.loading = false; // Continue even if claims fail
      }
    });
  }

  getActivePoliciesCount(): number {
    return this.policies.filter(p => p.status === 'ACTIVE').length;
  }

  getTotalPremium(): number {
    return this.policies.reduce((total, policy) => total + (policy.premiumPaid || 0), 0);
  }

  getPendingClaimsCount(): number {
    return this.claims.filter(c => c.status === 'PENDING' || c.status === 'SUBMITTED').length;
  }

  getPaymentStatus(policyId: string): string {
    const policyPayments = this.payments.filter(p => p.userPolicyId === policyId);
    if (policyPayments.length === 0) {
      return 'No Payments';
    }
    // For now, assume if there are payments, it's paid
    // You can enhance this logic based on your payment status requirements
    return 'Paid';
  }

  getPaymentStatusClass(policyId: string): string {
    const status = this.getPaymentStatus(policyId);
    switch (status) {
      case 'Paid':
        return 'text-green-600';
      case 'No Payments':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING_AGENT':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  viewPolicyDetails(policy: any): void {
    this.selectedPolicy = policy;
  }

  closePolicyDetails(): void {
    this.selectedPolicy = null;
  }

  getPolicyDuration(policy: any): string {
    if (!policy?.startDate || !policy?.endDate) return 'N/A';
    
    const start = new Date(policy.startDate);
    const end = new Date(policy.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `and ${months} month${months > 1 ? 's' : ''}` : ''}`;
    } else {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
  }

  makePaymentForPolicy(policy: any): void {
    // Navigate to payments page with pre-selected policy
    window.location.href = `/customer/payments?policy=${policy._id}`;
  }

  fileClaimForPolicy(policy: any): void {
    // Navigate to claims page with pre-selected policy
    window.location.href = `/customer/claims?policy=${policy._id}`;
  }
}


