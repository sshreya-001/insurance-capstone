import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { PolicyProduct, PurchasePolicyRequest } from '../../models/policy.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements OnInit {
  policies: PolicyProduct[] = [];
  currentUser: User | null = null;
  loading = true;
  purchaseForm: FormGroup;
  selectedPolicy: PolicyProduct | null = null;
  showPurchaseModal = false;
  purchasing = false;

  constructor(
    private policyService: PolicyService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.purchaseForm = this.fb.group({
      termMonths: ['', [Validators.min(1)]],
      nomineeName: ['', [Validators.required]],
      nomineeRelation: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.loading = true;
    this.policyService.getPolicyProducts().subscribe({
      next: (policies) => {
        this.policies = policies;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading policies:', error);
        this.loading = false;
      }
    });
  }

  openPurchaseModal(policy: PolicyProduct): void {
    if (this.currentUser?.role !== 'customer') {
      alert('Only customers can purchase policies');
      return;
    }
    
    this.selectedPolicy = policy;
    this.purchaseForm.patchValue({
      termMonths: policy.termMonths
    });
    this.showPurchaseModal = true;
  }

  closePurchaseModal(): void {
    this.showPurchaseModal = false;
    this.selectedPolicy = null;
    this.purchaseForm.reset();
  }

  purchasePolicy(): void {
    if (this.purchaseForm.valid && this.selectedPolicy) {
      this.purchasing = true;
      
      const request: PurchasePolicyRequest = {
        termMonths: this.purchaseForm.value.termMonths || this.selectedPolicy.termMonths,
        nominee: {
          name: this.purchaseForm.value.nomineeName,
          relation: this.purchaseForm.value.nomineeRelation
        }
      };

      this.policyService.purchasePolicy(this.selectedPolicy._id, request).subscribe({
        next: (response) => {
          this.purchasing = false;
          this.closePurchaseModal();
          alert('Policy purchased successfully!');
        },
        error: (error) => {
          this.purchasing = false;
          alert('Error purchasing policy: ' + (error.error?.message || 'Unknown error'));
        }
      });
    }
  }
}