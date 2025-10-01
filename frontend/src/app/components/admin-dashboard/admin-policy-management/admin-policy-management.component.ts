import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { PolicyProduct } from '../../../models/policy.model';

@Component({
  selector: 'app-admin-policy-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-2xl font-bold text-gray-800">Policy Management</h3>
          <p class="text-gray-600 mt-1">Manage insurance policies and products</p>
        </div>
        <button 
          (click)="openCreateModal()" 
          class="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <span class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create New Policy
          </span>
        </button>
      </div>

      <!-- Policies Table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="overflow-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 font-medium">Policy Name</th>
                <th class="py-3 px-4 font-medium">Code</th>
                <th class="py-3 px-4 font-medium">Premium</th>
                <th class="py-3 px-4 font-medium">Term (Months)</th>
                <th class="py-3 px-4 font-medium">Min Sum Insured</th>
                <th class="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let policy of policies" class="border-t border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4 font-medium text-gray-800">{{ policy.title }}</td>
                <td class="py-3 px-4 text-gray-600">{{ policy.code }}</td>
                <td class="py-3 px-4 text-gray-600">{{ formatCurrency(policy.premium) }}</td>
                <td class="py-3 px-4 text-gray-600">{{ policy.termMonths }}</td>
                <td class="py-3 px-4 text-gray-600">{{ formatCurrency(policy.minSumInsured) }}</td>
                <td class="py-3 px-4">
                  <div class="flex space-x-2">
                    <button 
                      (click)="openEditModal(policy)" 
                      class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Edit
                    </button>
                    <button 
                      (click)="deletePolicy(policy._id)" 
                      class="text-red-600 hover:text-red-700 text-sm font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create/Edit Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
          <div class="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-2xl font-bold text-gray-800">
                  {{ editingPolicy ? 'Edit Policy' : 'Create New Policy' }}
                </h3>
                <p class="text-gray-600 mt-1">
                  {{ editingPolicy ? 'Update policy details' : 'Add a new insurance policy to the system' }}
                </p>
              </div>
              <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
          
          <form [formGroup]="policyForm" (ngSubmit)="savePolicy()" class="p-8">
            <div class="space-y-6">
              <!-- Policy Title -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-3">Policy Title *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    formControlName="title" 
                    placeholder="Enter policy title"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                </div>
              </div>

              <!-- Policy Code -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-3">Policy Code *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    formControlName="code" 
                    placeholder="Enter unique policy code"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                </div>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-3">Description *</label>
                <div class="relative">
                  <div class="absolute top-3 left-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <textarea 
                    formControlName="description" 
                    rows="4" 
                    placeholder="Describe the policy coverage and benefits..."
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"></textarea>
                </div>
              </div>

              <!-- Premium and Term Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-3">Premium (₹) *</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                    </div>
                    <input 
                      type="number" 
                      formControlName="premium" 
                      placeholder="Enter premium amount"
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-bold text-gray-700 mb-3">Term (Months) *</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <input 
                      type="number" 
                      formControlName="termMonths" 
                      placeholder="Enter term in months"
                      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                  </div>
                </div>
              </div>

              <!-- Min Sum Insured -->
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-3">Minimum Sum Insured (₹) *</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <input 
                    type="number" 
                    formControlName="minSumInsured" 
                    placeholder="Enter minimum sum insured"
                    class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white/50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                </div>
              </div>
            </div>

            <!-- Form Validation Messages -->
            <div *ngIf="policyForm.invalid && policyForm.touched" class="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
                <div class="text-sm text-red-700">
                  <p *ngIf="policyForm.get('title')?.hasError('required')">Please enter a policy title</p>
                  <p *ngIf="policyForm.get('code')?.hasError('required')">Please enter a policy code</p>
                  <p *ngIf="policyForm.get('description')?.hasError('required')">Please provide a description</p>
                  <p *ngIf="policyForm.get('premium')?.hasError('required')">Please enter premium amount</p>
                  <p *ngIf="policyForm.get('premium')?.hasError('min')">Premium must be greater than 0</p>
                  <p *ngIf="policyForm.get('termMonths')?.hasError('required')">Please enter term in months</p>
                  <p *ngIf="policyForm.get('termMonths')?.hasError('min')">Term must be at least 1 month</p>
                  <p *ngIf="policyForm.get('minSumInsured')?.hasError('required')">Please enter minimum sum insured</p>
                  <p *ngIf="policyForm.get('minSumInsured')?.hasError('min')">Sum insured must be greater than 0</p>
                </div>
              </div>
            </div>

            <!-- Modal Actions -->
            <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                (click)="closeModal()" 
                class="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                [disabled]="policyForm.invalid || saving"
                class="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl font-bold transition-all duration-300 flex items-center">
                <span *ngIf="saving" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                {{ saving ? 'Saving...' : (editingPolicy ? 'Update Policy' : 'Create Policy') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class AdminPolicyManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  policies: PolicyProduct[] = [];
  showModal = false;
  editingPolicy: PolicyProduct | null = null;
  saving = false;

  policyForm: FormGroup;

  constructor() {
    this.policyForm = this.fb.group({
      title: ['', [Validators.required]],
      code: ['', [Validators.required]],
      description: ['', [Validators.required]],
      premium: ['', [Validators.required, Validators.min(1)]],
      termMonths: ['', [Validators.required, Validators.min(1)]],
      minSumInsured: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.http.get<PolicyProduct[]>(`${environment.apiUrl}/policies`).subscribe({
      next: (policies) => {
        this.policies = policies;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  openCreateModal(): void {
    this.editingPolicy = null;
    this.policyForm.reset();
    this.showModal = true;
  }

  openEditModal(policy: PolicyProduct): void {
    this.editingPolicy = policy;
    this.policyForm.patchValue(policy);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPolicy = null;
    this.policyForm.reset();
  }

  savePolicy(): void {
    if (this.policyForm.valid) {
      this.saving = true;
      
      const policyData = this.policyForm.value;
      
      if (this.editingPolicy) {
        // Update existing policy
        this.http.put(`${environment.apiUrl}/policies/${this.editingPolicy._id}`, policyData).subscribe({
          next: () => {
            this.saving = false;
            this.closeModal();
            this.loadPolicies();
          },
          error: (error) => {
            this.saving = false;
            console.error('Error updating policy:', error);
            alert('Error updating policy: ' + (error.error?.message || error.message || 'Unknown error'));
          }
        });
      } else {
        // Create new policy
        this.http.post(`${environment.apiUrl}/policies`, policyData).subscribe({
          next: () => {
            this.saving = false;
            this.closeModal();
            this.loadPolicies();
          },
          error: (error) => {
            this.saving = false;
            console.error('Error creating policy:', error);
            alert('Error creating policy: ' + (error.error?.message || error.message || 'Unknown error'));
          }
        });
      }
    }
  }

  deletePolicy(policyId: string): void {
    if (confirm('Are you sure you want to delete this policy?')) {
      this.http.delete(`${environment.apiUrl}/policies/${policyId}`).subscribe({
        next: () => {
          this.loadPolicies();
        },
        error: (error) => {
          console.error('Error deleting policy:', error);
          alert('Error deleting policy: ' + (error.error?.message || error.message || 'Unknown error'));
        }
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
