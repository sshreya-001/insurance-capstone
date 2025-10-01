import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PolicyService } from '../../services/policy.service';
import { ClaimService } from '../../services/claim.service';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { UserPolicy } from '../../models/policy.model';
import { Claim } from '../../models/claim.model';
import { AdminSummary } from '../../models/admin.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [TitleCasePipe]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  userPolicies: UserPolicy[] = [];
  userClaims: Claim[] = [];
  adminSummary: AdminSummary | null = null;
  loading = true;

  constructor(
    private authService: AuthService,
    private policyService: PolicyService,
    private claimService: ClaimService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    if (this.currentUser?.role === 'admin') {
      this.adminService.getSummary().subscribe({
        next: (summary) => {
          this.adminSummary = summary;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading admin summary:', error);
          this.loading = false;
        }
      });
    } else if (this.currentUser?.role === 'customer') {
      // Load customer data
      this.policyService.getMyPolicies().subscribe({
        next: (policies) => {
          this.userPolicies = policies;
          this.loadClaims();
        },
        error: (error) => {
          console.error('Error loading policies:', error);
          this.loading = false;
        }
      });
    } else if (this.currentUser?.role === 'agent') {
      // Load agent data
      this.claimService.getClaims().subscribe({
        next: (claims) => {
          this.userClaims = claims;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading claims:', error);
          this.loading = false;
        }
      });
    }
  }

  loadClaims(): void {
    this.claimService.getClaims().subscribe({
      next: (claims) => {
        this.userClaims = claims;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading claims:', error);
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}