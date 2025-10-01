import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div class="w-[min(1200px,95vw)] mx-auto px-4">
        <!-- Enhanced Header Section -->
        <div class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  Agent Dashboard
                </h1>
                <p class="text-gray-600 text-xl font-light">Manage your customers, policies, and claims efficiently</p>
              </div>
              <div class="hidden lg:block">
                <div class="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
            <h3 class="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-600 text-sm font-medium mb-1">Policies Sold</p>
                    <p class="text-4xl font-bold text-blue-800">{{ summary?.policiesSold || 0 }}</p>
                  </div>
                  <div class="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="group bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-600 text-sm font-medium mb-1">Active Policies</p>
                    <p class="text-4xl font-bold text-green-800">{{ summary?.activePolicies || 0 }}</p>
                  </div>
                  <div class="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="group bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-yellow-600 text-sm font-medium mb-1">Pending Claims</p>
                    <p class="text-4xl font-bold text-yellow-800">{{ summary?.pendingClaims || 0 }}</p>
                  </div>
                  <div class="p-3 bg-yellow-500 rounded-xl group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-600 text-sm font-medium mb-1">Total Commission</p>
                    <p class="text-4xl font-bold text-purple-800">{{ formatCurrency(summary?.commission || 0) }}</p>
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

        <!-- Recent Claims -->
        <div *ngIf="!loading && !error" class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200/50 bg-gray-50/80">
              <h3 class="text-2xl font-bold text-gray-800">Recent Claims to Review</h3>
              <p class="text-gray-600 mt-1">Review and process pending insurance claims</p>
            </div>
            
            <div class="p-6">
              <div *ngIf="claims.length === 0" class="text-center py-12">
                <div class="text-gray-400 mb-4">
                  <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-700 mb-2">No claims to review</h3>
                <p class="text-gray-500">All claims have been processed or no new claims are pending.</p>
              </div>
              
              <div *ngIf="claims.length > 0" class="overflow-auto">
                <table class="min-w-full text-left text-sm">
                  <thead class="bg-gray-50/80 text-gray-700">
                    <tr>
                      <th class="py-4 px-6 font-semibold">Policy</th>
                      <th class="py-4 px-6 font-semibold">Amount</th>
                      <th class="py-4 px-6 font-semibold">Status</th>
                      <th class="py-4 px-6 font-semibold">Submitted</th>
                      <th class="py-4 px-6 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr *ngFor="let claim of claims" class="hover:bg-gray-50/50 transition-colors">
                      <td class="py-4 px-6">
                        <div class="font-medium text-gray-800">{{ claim?.userPolicyId?.policyProductId?.title || 'Unknown Policy' }}</div>
                        <div class="text-gray-600 text-sm">{{ claim?.userPolicyId?.policyProductId?.code || 'N/A' }}</div>
                      </td>
                      <td class="py-4 px-6 font-medium text-gray-700">{{ formatCurrency(claim?.amountClaimed || 0) }}</td>
                      <td class="py-4 px-6">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                              [class]="getStatusBadgeClass(claim?.status)">
                          {{ claim?.status }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-gray-600">{{ claim?.createdAt | date:'medium' }}</td>
                      <td class="py-4 px-6">
                        <button (click)="openClaimReview(claim)" 
                                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Review
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- My Customers -->
        <div *ngIf="!loading && !error" class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200/50 bg-gray-50/80">
              <h3 class="text-2xl font-bold text-gray-800">My Customers</h3>
              <p class="text-gray-600 mt-1">Manage your assigned customers and their policies</p>
            </div>
            
            <div class="p-6">
              <div *ngIf="customers.length === 0" class="text-center py-12">
                <div class="text-gray-400 mb-4">
                  <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-700 mb-2">No customers assigned</h3>
                <p class="text-gray-500">You don't have any customers assigned to you yet.</p>
              </div>
              
              <div *ngIf="customers.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div *ngFor="let customer of customers" 
                     class="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="font-bold text-gray-800 text-lg">{{ customer?.name || 'Unknown' }}</h4>
                      <p class="text-gray-600 text-sm">{{ customer?.email || 'No email' }}</p>
                    </div>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                      <span class="font-medium">{{ customer?.policies?.length || 0 }}</span> policies
                    </div>
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Assigned Policies -->
        <div *ngIf="!loading && !error" class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200/50 bg-gray-50/80">
              <h3 class="text-2xl font-bold text-gray-800">My Assigned Policies</h3>
              <p class="text-gray-600 mt-1">View and manage policies assigned to you</p>
            </div>
            
            <div class="p-6">
              <div *ngIf="assignedPolicies.length === 0" class="text-center py-12">
                <div class="text-gray-400 mb-4">
                  <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 class="text-xl font-medium text-gray-700 mb-2">No policies assigned</h3>
                <p class="text-gray-500">No policies have been assigned to you yet.</p>
              </div>
              
              <div *ngIf="assignedPolicies.length > 0" class="overflow-auto">
                <table class="min-w-full text-left text-sm">
                  <thead class="bg-gray-50/80 text-gray-700">
                    <tr>
                      <th class="py-4 px-6 font-semibold">Policy</th>
                      <th class="py-4 px-6 font-semibold">Customer</th>
                      <th class="py-4 px-6 font-semibold">Premium</th>
                      <th class="py-4 px-6 font-semibold">Status</th>
                      <th class="py-4 px-6 font-semibold">Start Date</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    <tr *ngFor="let policy of assignedPolicies" class="hover:bg-gray-50/50 transition-colors">
                      <td class="py-4 px-6">
                        <div class="font-medium text-gray-800">{{ policy?.policyProductId?.title || 'Unknown Policy' }}</div>
                        <div class="text-gray-600 text-sm">{{ policy?.policyProductId?.code || 'N/A' }}</div>
                      </td>
                      <td class="py-4 px-6">
                        <div class="font-medium text-gray-800">{{ policy?.userId?.name || 'Unknown Customer' }}</div>
                        <div class="text-gray-600 text-sm">{{ policy?.userId?.email || 'N/A' }}</div>
                      </td>
                      <td class="py-4 px-6 font-medium text-gray-700">{{ formatCurrency(policy?.premiumPaid || 0) }}</td>
                      <td class="py-4 px-6">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                              [class]="getStatusBadgeClass(policy?.status)">
                          {{ policy?.status }}
                        </span>
                      </td>
                      <td class="py-4 px-6 text-gray-600">{{ policy?.startDate | date:'medium' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Claim Review Modal -->
      <div *ngIf="showClaimReviewModal && selectedClaim" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
          <div class="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold text-gray-800">Review Insurance Claim</h3>
                <p class="text-gray-600 mt-1">Carefully review the claim details before making a decision</p>
              </div>
              <button (click)="closeClaimReview()" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="p-8">
            <!-- Claim Details -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                <h4 class="text-xl font-bold text-blue-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Customer Information
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1">Name</label>
                    <p class="text-blue-900 font-semibold">{{ selectedClaim?.userId?.name || 'Unknown Customer' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-700 mb-1">Email</label>
                    <p class="text-blue-900">{{ selectedClaim?.userId?.email || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                <h4 class="text-xl font-bold text-green-800 mb-4 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Policy Information
                </h4>
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium text-green-700 mb-1">Policy</label>
                    <p class="text-green-900 font-semibold">{{ selectedClaim?.userPolicyId?.policyProductId?.title || 'Unknown Policy' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-green-700 mb-1">Policy Code</label>
                    <p class="text-green-900">{{ selectedClaim?.userPolicyId?.policyProductId?.code || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Claim Information -->
            <div class="mb-8">
              <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                <h4 class="text-xl font-bold text-purple-800 mb-6 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  Claim Details
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-purple-700 mb-2">Incident Date</label>
                    <p class="text-purple-900 font-semibold">{{ selectedClaim?.incidentDate | date:'fullDate' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-purple-700 mb-2">Amount Claimed</label>
                    <p class="text-purple-900 text-2xl font-bold">{{ formatCurrency(selectedClaim?.amountClaimed || 0) }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-purple-700 mb-2">Description</label>
                    <div class="bg-white/80 p-4 rounded-xl border border-purple-200">
                      <p class="text-purple-900">{{ selectedClaim?.description }}</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-purple-700 mb-2">Current Status</label>
                    <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium"
                          [class]="getStatusBadgeClass(selectedClaim?.status)">
                      {{ selectedClaim?.status }}
                    </span>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-purple-700 mb-2">Submitted</label>
                    <p class="text-purple-900 font-semibold">{{ selectedClaim?.createdAt | date:'fullDate' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Review Form -->
            <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
              <h4 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Review Decision
              </h4>
              <form (ngSubmit)="submitClaimReview()" class="space-y-6">
                <div>
                  <label for="decision" class="block text-sm font-bold text-gray-700 mb-3">Decision</label>
                  <select id="decision" [(ngModel)]="claimReview.decision" name="decision" required
                          class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium">
                    <option value="">Select Decision</option>
                    <option value="APPROVED" class="text-green-600">✅ Approve Claim</option>
                    <option value="REJECTED" class="text-red-600">❌ Reject Claim</option>
                  </select>
                </div>
                <div>
                  <label for="notes" class="block text-sm font-bold text-gray-700 mb-3">Review Notes</label>
                  <textarea id="notes" [(ngModel)]="claimReview.notes" name="notes" rows="4"
                            placeholder="Provide detailed notes about your decision..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"></textarea>
                </div>
                <div class="flex justify-end space-x-4 pt-4">
                  <button type="button" (click)="closeClaimReview()"
                          class="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" [disabled]="!claimReview.decision || submitting"
                          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl font-bold transition-colors flex items-center">
                    <span *ngIf="submitting" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    {{ submitting ? 'Submitting...' : 'Submit Review' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AgentDashboardComponent implements OnInit {
  private http = inject(HttpClient);

  summary: any = {};
  claims: any[] = [];
  customers: any[] = [];
  assignedPolicies: any[] = [];
  loading = true;
  error: string | null = null;
  
  // Claim review properties
  showClaimReviewModal = false;
  selectedClaim: any = null;
  submitting = false;
  claimReview = {
    decision: '',
    notes: ''
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    let completedRequests = 0;
    const totalRequests = 4;

    const checkComplete = () => {
      completedRequests++;
      if (completedRequests === totalRequests) {
        this.loading = false;
      }
    };

    // Load summary data
    this.http.get(`${environment.apiUrl}/agents/dashboard`).subscribe({
      next: (data) => {
        this.summary = data || {};
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading summary:', error);
        this.error = 'Failed to load dashboard data';
        checkComplete();
      }
    });

    // Load claims
    this.http.get<any[]>(`${environment.apiUrl}/claims`).subscribe({
      next: (data) => {
        this.claims = (data || []).filter((claim: any) => claim.status === 'PENDING');
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.claims = [];
        checkComplete();
      }
    });

    // Load customers (only assigned to this agent)
    this.http.get<any[]>(`${environment.apiUrl}/agents/customers`).subscribe({
      next: (data) => {
        console.log('Customers data received:', data);
        this.customers = data || [];
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.customers = [];
        checkComplete();
      }
    });

    // Load assigned policies
    this.http.get<any[]>(`${environment.apiUrl}/agents/my-policies`).subscribe({
      next: (data) => {
        this.assignedPolicies = data || [];
        checkComplete();
      },
      error: (error) => {
        console.error('Error loading assigned policies:', error);
        this.assignedPolicies = [];
        checkComplete();
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
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

  // Claim review methods
  openClaimReview(claim: any): void {
    this.selectedClaim = { ...claim };
    this.claimReview = {
      decision: '',
      notes: ''
    };
    this.showClaimReviewModal = true;
  }

  closeClaimReview(): void {
    this.showClaimReviewModal = false;
    this.selectedClaim = null;
    this.claimReview = {
      decision: '',
      notes: ''
    };
  }

  submitClaimReview(): void {
    if (!this.claimReview.decision || !this.selectedClaim) {
      alert('Please select a decision');
      return;
    }

    this.submitting = true;
    
    const reviewData = {
      status: this.claimReview.decision,
      decisionNotes: this.claimReview.notes
    };

    this.http.put(`${environment.apiUrl}/claims/${this.selectedClaim._id}/status`, reviewData).subscribe({
      next: (response) => {
        this.submitting = false;
        alert(`Claim ${this.claimReview.decision.toLowerCase()}d successfully!`);
        this.closeClaimReview();
        this.loadDashboardData(); // Reload to update the claims list
      },
      error: (error) => {
        this.submitting = false;
        console.error('Error reviewing claim:', error);
        alert('Error reviewing claim: ' + (error.error?.message || error.message));
      }
    });
  }
}


