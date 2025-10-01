import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create-policy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div class="w-[min(1200px,95vw)] mx-auto px-4">
        <!-- Enhanced Header Section -->
        <div class="mb-8">
          <div class="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                  Create New Policy
                </h1>
                <p class="text-gray-600 text-xl font-light">Add a new insurance policy to the system</p>
              </div>
              <div class="hidden lg:block">
                <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Policy Creation Form -->
        <div class="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <form [formGroup]="policyForm" (ngSubmit)="createPolicy()" class="p-8">
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

            <!-- Success Message -->
            <div *ngIf="successMessage" class="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-sm text-green-700">
                  <p>{{ successMessage }}</p>
                </div>
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                (click)="goBack()"
                class="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="policyForm.invalid || creating"
                class="flex-1 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-300 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center">
                <span *ngIf="creating" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                {{ creating ? 'Creating Policy...' : 'Create Policy' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `,
})
export class CreatePolicyComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  policyForm: FormGroup;
  creating = false;
  successMessage = '';

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
    // Check if user is logged in and has admin role
    this.auth.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      if (user.role !== 'admin') {
        this.router.navigate(['/']);
        return;
      }
    });
  }

  createPolicy(): void {
    if (this.policyForm.valid) {
      this.creating = true;
      this.successMessage = '';
      
      const policyData = this.policyForm.value;
      
      this.http.post(`${environment.apiUrl}/policies`, policyData).subscribe({
        next: (response) => {
          this.creating = false;
          this.successMessage = 'Policy created successfully!';
          this.policyForm.reset();
          
          // Redirect to admin dashboard after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 2000);
        },
        error: (error) => {
          this.creating = false;
          console.error('Error creating policy:', error);
          alert('Error creating policy: ' + (error.error?.message || error.message || 'Unknown error'));
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
