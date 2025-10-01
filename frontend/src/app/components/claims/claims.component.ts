import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClaimService } from '../../services/claim.service';
import { PolicyService } from '../../services/policy.service';
import { AuthService } from '../../services/auth.service';
import { Claim, SubmitClaimRequest } from '../../models/claim.model';
import { UserPolicy } from '../../models/policy.model';

@Component({
  selector: 'app-claims',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './claims.component.html',
  styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit {
  private claimService = inject(ClaimService);
  private policyService = inject(PolicyService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  claims: Claim[] = [];
  userPolicies: UserPolicy[] = [];
  loading = true;
  showSubmitModal = false;
  submitting = false;

  claimForm: FormGroup;

  constructor() {
    this.claimForm = this.fb.group({
      userPolicyId: ['', [Validators.required]],
      incidentDate: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      amountClaimed: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadClaims();
    this.loadUserPolicies();
    
    // Check for pre-selected policy from URL
    this.route.queryParams.subscribe(params => {
      if (params['policy']) {
        // Pre-select the policy and open submit modal after policies are loaded
        setTimeout(() => {
          this.claimForm.patchValue({ userPolicyId: params['policy'] });
          this.openSubmitModal();
        }, 1000);
      }
    });
  }

  loadClaims(): void {
    this.loading = true;
    this.claimService.getClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.loading = false;
      }
    });
  }

  loadUserPolicies(): void {
    this.policyService.getMyPolicies().subscribe({
      next: (policies) => {
        this.userPolicies = policies.filter((p: any) => p.status === 'ACTIVE');
      },
      error: (error) => {
        console.error('Error loading policies:', error);
      }
    });
  }

  openSubmitModal(): void {
    if (this.userPolicies.length === 0) {
      alert('You need to have an active policy to submit a claim');
      return;
    }
    this.showSubmitModal = true;
  }

  closeSubmitModal(): void {
    this.showSubmitModal = false;
    this.claimForm.reset();
  }

  submitClaim(): void {
    if (this.claimForm.valid) {
      this.submitting = true;
      
      const claimData: SubmitClaimRequest = {
        userPolicyId: this.claimForm.value.userPolicyId,
        incidentDate: new Date(this.claimForm.value.incidentDate),
        description: this.claimForm.value.description,
        amountClaimed: this.claimForm.value.amountClaimed
      };

      this.claimService.submitClaim(claimData).subscribe({
        next: (response) => {
          this.submitting = false;
          this.closeSubmitModal();
          this.loadClaims(); // Refresh claims list
          alert('Claim submitted successfully!');
        },
        error: (error) => {
          this.submitting = false;
          alert('Error submitting claim: ' + (error.error?.message || 'Unknown error'));
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

  getPolicyName(claim: Claim): string {
    if (claim.userPolicyId && typeof claim.userPolicyId === 'object') {
      return (claim.userPolicyId as any).policyProductId.title || (claim.userPolicyId as any).policyProductId.code || 'Unknown Policy';
    }
    return 'Unknown Policy';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
