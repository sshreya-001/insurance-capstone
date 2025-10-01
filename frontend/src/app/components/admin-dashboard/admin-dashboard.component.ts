import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AdminPolicyManagementComponent } from './admin-policy-management/admin-policy-management.component';
import { AdminUserManagementComponent } from './admin-user-management/admin-user-management.component';
import { AdminClaimsManagementComponent } from './admin-claims-management/admin-claims-management.component';
import { AdminAgentManagementComponent } from './admin-agent-management/admin-agent-management.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AdminPolicyManagementComponent, AdminUserManagementComponent, AdminClaimsManagementComponent, AdminAgentManagementComponent],
  template: `
    <section class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div class="w-[min(1200px,95vw)] mx-auto px-4">
        <!-- Enhanced Header Section -->
        <div class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  Admin Dashboard
                </h1>
                <p class="text-gray-600 text-xl font-light">Manage your insurance platform with comprehensive oversight</p>
              </div>
              <div class="hidden lg:block">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          <p class="mt-4 text-gray-600 text-lg font-medium">Loading dashboard data...</p>
        </div>
        
        <!-- Error State -->
        <div *ngIf="error && !loading" class="text-center py-16">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-xl max-w-md mx-auto">
            <div class="text-red-500 mb-4">
              <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-4">{{ error }}</h3>
            <button (click)="loadDashboardData()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium">
              Try Again
            </button>
          </div>
        </div>

        <!-- Enhanced Summary Cards -->
        <div *ngIf="!loading && !error" class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Platform Overview</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-600 text-sm font-medium mb-1">Total Users</p>
                    <p class="text-4xl font-bold text-blue-800">{{ summary?.users || 0 }}</p>
                  </div>
                  <div class="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-600 text-sm font-medium mb-1">Policies Sold</p>
                    <p class="text-4xl font-bold text-green-800">{{ summary?.policiesSold || 0 }}</p>
                  </div>
                  <div class="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-600 text-sm font-medium mb-1">Active Policies</p>
                    <p class="text-4xl font-bold text-yellow-800">{{ summary?.activePolicies || 0 }}</p>
                  </div>
                  <div class="p-3 bg-yellow-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-600 text-sm font-medium mb-1">Total Revenue</p>
                    <p class="text-4xl font-bold text-purple-800">{{ formatCurrency(summary?.totalPayments || 0) }}</p>
                  </div>
                  <div class="p-3 bg-purple-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Navigation Tabs -->
        <div *ngIf="!loading && !error" class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div class="border-b border-gray-200/50">
              <nav class="flex space-x-1 p-2">
                <button 
                  *ngFor="let tab of tabs" 
                  (click)="activeTab = tab.id"
                  [class]="activeTab === tab.id ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'"
                  class="flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path *ngIf="tab.id === 'policies'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    <path *ngIf="tab.id === 'users'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    <path *ngIf="tab.id === 'claims'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    <path *ngIf="tab.id === 'agents'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    <path *ngIf="tab.id === 'audit'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>{{ tab.name }}</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        <!-- Enhanced Tab Content -->
        <div *ngIf="!loading && !error" class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <!-- Policy Management -->
          <app-admin-policy-management *ngIf="activeTab === 'policies'"></app-admin-policy-management>
          
          <!-- User Management -->
          <app-admin-user-management *ngIf="activeTab === 'users'"></app-admin-user-management>
          
          <!-- Claims Management -->
          <app-admin-claims-management *ngIf="activeTab === 'claims'"></app-admin-claims-management>
          
          <!-- Agent Management -->
          <app-admin-agent-management *ngIf="activeTab === 'agents'"></app-admin-agent-management>
          
          <!-- Enhanced Audit Logs -->
          <div *ngIf="activeTab === 'audit'" class="p-8">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-800">Audit Logs</h3>
              <button (click)="loadDashboardData()" class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </button>
            </div>
            
            <div *ngIf="audit.length === 0" class="text-center py-12">
              <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 class="text-xl font-medium text-gray-700 mb-2">No audit logs available</h3>
              <p class="text-gray-500">System activity will appear here as it occurs.</p>
            </div>
            
            <div *ngIf="audit.length > 0" class="overflow-auto">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-gray-50/80 text-gray-700">
                  <tr>
                    <th class="py-4 px-6 font-semibold">Timestamp</th>
                    <th class="py-4 px-6 font-semibold">User</th>
                    <th class="py-4 px-6 font-semibold">Action</th>
                    <th class="py-4 px-6 font-semibold">IP Address</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr *ngFor="let log of audit" class="hover:bg-gray-50/50 transition-colors">
                    <td class="py-4 px-6 text-gray-600 font-medium">{{ log?.timestamp | date:'medium' }}</td>
                    <td class="py-4 px-6 font-medium text-gray-700">{{ log?.userId || '-' }}</td>
                    <td class="py-4 px-6">
                      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ log?.action || log?.endpoint }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-gray-500 font-mono text-sm">{{ log?.ipAddress || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private http = inject(HttpClient);

  summary: any = {};
  audit: any[] = [];
  agents: any[] = [];
  loading = true;
  error: string | null = null;
  activeTab = 'policies';

  tabs = [
    { id: 'policies', name: 'Policy Management' },
    { id: 'users', name: 'User Management' },
    { id: 'claims', name: 'Claims Management' },
    { id: 'agents', name: 'Agent Management' },
    { id: 'audit', name: 'Audit Logs' }
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    // Load summary data
    this.http.get(`${environment.apiUrl}/admin/summary`).subscribe({
      next: (data) => {
        this.summary = data || {};
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.error = 'Failed to load dashboard data';
      }
    });

    // Load audit logs
    this.http.get<any[]>(`${environment.apiUrl}/admin/audit`).subscribe({
      next: (data) => {
        this.audit = data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.audit = [];
      }
    });

    // Load agents
    this.http.get<any[]>(`${environment.apiUrl}/agents`).subscribe({
      next: (data) => {
        this.agents = data || [];
      },
      error: (error) => {
        console.error('Error loading agents:', error);
        this.agents = [];
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}


