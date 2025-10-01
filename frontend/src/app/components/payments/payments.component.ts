import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { Payment, MakePaymentRequest } from '../../models/payment.model';
import { UserPolicy } from '../../models/policy.model';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="min-h-screen bg-gray-50 py-8">
      <div class="w-[min(1100px,94vw)] mx-auto px-4 grid gap-6">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Payment History</h2>
              <p class="text-gray-600">View your payment history and manage policy payments</p>
            </div>
            <button 
              (click)="togglePaymentForm()" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              {{ showPaymentForm ? 'Hide Payment Form' : 'Make a Payment' }}
            </button>
          </div>
        </div>

        <!-- Payment Form (Hidden by default) -->
        <div *ngIf="showPaymentForm" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Make a Payment</h3>
          
          <form [formGroup]="paymentForm" (ngSubmit)="makePayment()" class="space-y-6">
            <!-- Policy Selection -->
            <div>
              <label for="userPolicyId" class="block text-sm font-medium text-gray-700 mb-2">Select Policy</label>
              <select 
                id="userPolicyId"
                formControlName="userPolicyId" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Choose a policy...</option>
                <option *ngFor="let policy of activePolicies" [value]="policy._id">
                  {{ policy.policyProductId.title || 'Unknown Policy' }} - 
                  Premium: {{ formatCurrency(policy.premiumPaid || 0) }}
                </option>
              </select>
              <div *ngIf="paymentForm.get('userPolicyId')?.invalid && paymentForm.get('userPolicyId')?.touched" 
                   class="mt-1 text-sm text-red-600">
                Please select a policy
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <label for="method" class="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select 
                id="method"
                formControlName="method" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select payment method...</option>
                <option value="CARD">Credit/Debit Card</option>
                <option value="NETBANKING">Net Banking</option>
                <option value="UPI">UPI</option>
                <option value="WALLET">Digital Wallet</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="OFFLINE">Offline Payment</option>
                <option value="SIMULATED">Simulated Payment</option>
              </select>
              <div *ngIf="paymentForm.get('method')?.invalid && paymentForm.get('method')?.touched" 
                   class="mt-1 text-sm text-red-600">
                Please select a payment method
              </div>
            </div>

            <!-- Payment Reference -->
            <div>
              <label for="reference" class="block text-sm font-medium text-gray-700 mb-2">Transaction Reference</label>
              <input 
                type="text"
                id="reference"
                formControlName="reference" 
                placeholder="Enter transaction reference number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div *ngIf="paymentForm.get('reference')?.invalid && paymentForm.get('reference')?.touched" 
                   class="mt-1 text-sm text-red-600">
                Transaction reference is required
              </div>
            </div>

            <!-- Payment Amount Display -->
            <div *ngIf="selectedPolicy" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex justify-between items-center">
                <div>
                  <h4 class="font-medium text-blue-800">Payment Amount</h4>
                  <p class="text-sm text-blue-600">{{ selectedPolicy.policyProductId.title || 'Unknown Policy' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-blue-800">{{ formatCurrency(selectedPolicy.premiumPaid || 0) }}</p>
                  <p class="text-sm text-blue-600">Premium Amount</p>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button 
                type="submit" 
                [disabled]="paymentForm.invalid || processing"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors">
                <span *ngIf="processing" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ processing ? 'Processing Payment...' : 'Make Payment' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Payment History -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-gray-800">Your Payment History</h3>
            <button 
              (click)="loadPaymentHistory()" 
              class="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>

          <!-- Loading State -->
          <div *ngIf="loadingPayments" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p class="mt-2 text-gray-600">Loading payment history...</p>
          </div>

          <!-- Empty State -->
          <div *ngIf="!loadingPayments && payments.length === 0" class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <svg class="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 class="text-xl font-medium text-gray-700 mb-2">No payments found</h3>
            <p class="text-gray-500 mb-6">You haven't made any payments yet. Click "Make a Payment" to get started.</p>
            <button 
              (click)="togglePaymentForm()" 
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              Make Your First Payment
            </button>
          </div>

          <!-- Payments Table -->
          <div *ngIf="!loadingPayments && payments.length > 0" class="overflow-auto">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-gray-50 text-gray-700">
                <tr>
                  <th class="py-3 px-4 font-medium">Policy</th>
                  <th class="py-3 px-4 font-medium">Amount</th>
                  <th class="py-3 px-4 font-medium">Method</th>
                  <th class="py-3 px-4 font-medium">Reference</th>
                  <th class="py-3 px-4 font-medium">Date</th>
                  <th class="py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let payment of payments" class="border-t border-gray-200 hover:bg-gray-50">
                  <td class="py-3 px-4">
                    <div class="font-medium text-gray-800">{{ getPolicyTitle(payment) }}</div>
                    <div class="text-gray-600 text-sm">{{ getPolicyCode(payment) }}</div>
                  </td>
                  <td class="py-3 px-4 font-medium text-gray-700">{{ formatCurrency(payment.amount || 0) }}</td>
                  <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ formatPaymentMethod(payment.method) }}
                    </span>
                  </td>
                  <td class="py-3 px-4 text-gray-600 font-mono text-sm">{{ payment.reference || 'N/A' }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ payment.createdAt | date:'medium' }}</td>
                  <td class="py-3 px-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Payment Summary -->
        <div *ngIf="payments.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Payment Summary</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-600">{{ payments.length }}</div>
              <div class="text-blue-800 font-medium">Total Payments</div>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-600">{{ formatCurrency(getTotalAmount()) }}</div>
              <div class="text-green-800 font-medium">Total Amount Paid</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-2xl font-bold text-purple-600">{{ getUniquePolicies() }}</div>
              <div class="text-purple-800 font-medium">Policies Paid</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class PaymentsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private policyService = inject(PolicyService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  currentUser: User | null = null;
  activePolicies: UserPolicy[] = [];
  payments: Payment[] = [];
  selectedPolicy: UserPolicy | null = null;
  loadingPayments = false;
  processing = false;
  showPaymentForm = false;

  paymentForm: FormGroup;

  constructor() {
    this.paymentForm = this.fb.group({
      userPolicyId: ['', [Validators.required]],
      method: ['', [Validators.required]],
      reference: ['', [Validators.required]]
    });

    // Watch for policy selection changes
    this.paymentForm.get('userPolicyId')?.valueChanges.subscribe(policyId => {
      this.selectedPolicy = this.activePolicies.find(p => p._id === policyId) || null;
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser as any;
    this.loadActivePolicies();
    this.loadPaymentHistory();
    
    // Check for pre-selected policy from URL
    this.route.queryParams.subscribe(params => {
      if (params['policy']) {
        // Pre-select the policy after policies are loaded
        setTimeout(() => {
          this.paymentForm.patchValue({ userPolicyId: params['policy'] });
        }, 1000);
      }
    });
  }

  loadActivePolicies(): void {
    this.policyService.getMyPolicies().subscribe({
      next: (policies) => {
        this.activePolicies = policies.filter(policy => policy.status === 'ACTIVE');
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  loadPaymentHistory(): void {
    this.loadingPayments = true;
    this.paymentService.getMyPayments().subscribe({
      next: (payments) => {
        this.payments = payments;
        this.loadingPayments = false;
      },
      error: (error) => {
        console.error('Error loading payments:', error);
        this.loadingPayments = false;
      }
    });
  }

  makePayment(): void {
    if (this.paymentForm.valid) {
      this.processing = true;
      
      const request: MakePaymentRequest = {
        userPolicyId: this.paymentForm.value.userPolicyId,
        method: this.paymentForm.value.method,
        reference: this.paymentForm.value.reference
      };

      this.paymentService.makePayment(request).subscribe({
        next: (payment) => {
          this.processing = false;
          alert('Payment completed successfully!');
          this.paymentForm.reset();
          this.selectedPolicy = null;
          this.loadPaymentHistory();
        },
        error: (error) => {
          this.processing = false;
          console.error('Error making payment:', error);
          alert('Error making payment: ' + (error.error?.message || 'Unknown error'));
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

  formatPaymentMethod(method: string): string {
    const methods: { [key: string]: string } = {
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'net_banking': 'Net Banking',
      'upi': 'UPI',
      'wallet': 'Digital Wallet',
      'bank_transfer': 'Bank Transfer'
    };
    return methods[method] || method;
  }

  getTotalAmount(): number {
    return this.payments.reduce((total, payment) => total + (payment.amount || 0), 0);
  }

  getUniquePolicies(): number {
    const uniquePolicies = new Set(this.payments.map(payment => payment.userPolicyId));
    return uniquePolicies.size;
  }

  getPolicyTitle(payment: Payment): string {
    if (typeof payment.userPolicyId === 'string') {
      return 'Unknown Policy';
    }
    return payment.userPolicyId?.policyProductId?.title || 'Unknown Policy';
  }

  getPolicyCode(payment: Payment): string {
    if (typeof payment.userPolicyId === 'string') {
      return 'N/A';
    }
    return payment.userPolicyId?.policyProductId?.code || 'N/A';
  }

  togglePaymentForm(): void {
    this.showPaymentForm = !this.showPaymentForm;
    if (!this.showPaymentForm) {
      this.paymentForm.reset();
      this.selectedPolicy = null;
    }
  }
}
