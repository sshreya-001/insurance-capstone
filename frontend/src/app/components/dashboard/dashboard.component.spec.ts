import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleCasePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { PolicyService } from '../../services/policy.service';
import { ClaimService } from '../../services/claim.service';
import { AdminService } from '../../services/admin.service';
import { User } from '../../models/user.model';
import { UserPolicy } from '../../models/policy.model';
import { Claim } from '../../models/claim.model';
import { AdminSummary } from '../../models/admin.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let policyService: jasmine.SpyObj<PolicyService>;
  let claimService: jasmine.SpyObj<ClaimService>;
  let adminService: jasmine.SpyObj<AdminService>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    role: 'customer'
  };

  const mockAdminUser: User = {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin'
  };

  const mockAgentUser: User = {
    id: '1',
    name: 'Agent User',
    email: 'agent@test.com',
    role: 'agent'
  };

  const mockPolicies: UserPolicy[] = [
    {
      _id: '1',
      userId: '1',
      policyProductId: {
        _id: 'policy1',
        code: 'HI001',
        title: 'Health Insurance',
        description: 'Comprehensive health coverage',
        premium: 1000,
        termMonths: 12,
        minSumInsured: 500000
      },
      status: 'ACTIVE',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      premiumPaid: 1000,
      nominee: {
        name: 'John Doe',
        relation: 'Spouse'
      }
    }
  ];

  const mockClaims: Claim[] = [
    {
      _id: '1',
      userId: mockUser,
      userPolicyId: mockPolicies[0],
      incidentDate: new Date('2024-01-15'),
      description: 'Medical claim',
      amountClaimed: 5000,
      status: 'PENDING'
    }
  ];

  const mockAdminSummary: AdminSummary = {
    users: 100,
    policiesSold: 50,
    claimsPending: 25,
    totalPayments: 100000
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout'], {
      currentUser: null
    });
    const policyServiceSpy = jasmine.createSpyObj('PolicyService', ['getMyPolicies']);
    const claimServiceSpy = jasmine.createSpyObj('ClaimService', ['getClaims']);
    const adminServiceSpy = jasmine.createSpyObj('AdminService', ['getSummary']);

        await TestBed.configureTestingModule({
          imports: [DashboardComponent, TitleCasePipe, HttpClientTestingModule],
          providers: [
            { provide: AuthService, useValue: authServiceSpy },
            { provide: PolicyService, useValue: policyServiceSpy },
            { provide: ClaimService, useValue: claimServiceSpy },
            { provide: AdminService, useValue: adminServiceSpy }
          ]
        }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    policyService = TestBed.inject(PolicyService) as jasmine.SpyObj<PolicyService>;
    claimService = TestBed.inject(ClaimService) as jasmine.SpyObj<ClaimService>;
    adminService = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading true', () => {
    expect(component.loading).toBeTruthy();
  });

  it('should set current user on init', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    policyService.getMyPolicies.and.returnValue(of([]));
    
    component.ngOnInit();
    
    expect(component.currentUser).toEqual(mockUser);
  });

  it('should load admin data for admin user', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockAdminUser, writable: true });
    adminService.getSummary.and.returnValue(of(mockAdminSummary));
    
    component.ngOnInit();
    
    expect(adminService.getSummary).toHaveBeenCalled();
  });

  it('should set admin summary on successful load', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockAdminUser, writable: true });
    adminService.getSummary.and.returnValue(of(mockAdminSummary));
    
    component.ngOnInit();
    
    expect(component.adminSummary).toEqual(mockAdminSummary);
    expect(component.loading).toBeFalsy();
  });

  it('should handle admin data load error', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockAdminUser, writable: true });
    adminService.getSummary.and.returnValue(throwError(() => new Error('Admin data error')));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('Error loading admin summary:', jasmine.any(Error));
    expect(component.loading).toBeFalsy();
  });

  it('should load customer data for customer user', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    policyService.getMyPolicies.and.returnValue(of(mockPolicies));
    claimService.getClaims.and.returnValue(of(mockClaims));
    
    component.ngOnInit();
    
    expect(policyService.getMyPolicies).toHaveBeenCalled();
  });

  it('should set user policies and load claims for customer', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    policyService.getMyPolicies.and.returnValue(of(mockPolicies));
    claimService.getClaims.and.returnValue(of(mockClaims));
    
    component.ngOnInit();
    
    expect(component.userPolicies).toEqual(mockPolicies);
    expect(claimService.getClaims).toHaveBeenCalled();
  });

  it('should handle customer data load error', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    policyService.getMyPolicies.and.returnValue(throwError(() => new Error('Policies error')));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('Error loading policies:', jasmine.any(Error));
    expect(component.loading).toBeFalsy();
  });

  it('should load agent data for agent user', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockAgentUser, writable: true });
    claimService.getClaims.and.returnValue(of(mockClaims));
    
    component.ngOnInit();
    
    expect(claimService.getClaims).toHaveBeenCalled();
  });

  it('should set user claims for agent', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockAgentUser, writable: true });
    claimService.getClaims.and.returnValue(of(mockClaims));
    
    component.ngOnInit();
    
    expect(component.userClaims).toEqual(mockClaims);
    expect(component.loading).toBeFalsy();
  });

  it('should handle agent data load error', () => {
    Object.defineProperty(authService, 'currentUser', { value: mockAgentUser, writable: true });
    claimService.getClaims.and.returnValue(throwError(() => new Error('Claims error')));
    spyOn(console, 'error');
    
    component.ngOnInit();
    
    expect(console.error).toHaveBeenCalledWith('Error loading claims:', jasmine.any(Error));
    expect(component.loading).toBeFalsy();
  });

  it('should load claims for customer after policies are loaded', (done) => {
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    policyService.getMyPolicies.and.returnValue(of(mockPolicies));
    claimService.getClaims.and.returnValue(of(mockClaims));
    
    component.loadDashboardData();
    
    // Wait for async operations to complete
    setTimeout(() => {
      expect(claimService.getClaims).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('should set user claims and loading false on successful claims load', () => {
    claimService.getClaims.and.returnValue(of(mockClaims));
    
    component.loadClaims();
    
    expect(component.userClaims).toEqual(mockClaims);
    expect(component.loading).toBeFalsy();
  });

  it('should handle claims load error', () => {
    claimService.getClaims.and.returnValue(throwError(() => new Error('Claims error')));
    spyOn(console, 'error');
    
    component.loadClaims();
    
    expect(console.error).toHaveBeenCalledWith('Error loading claims:', jasmine.any(Error));
    expect(component.loading).toBeFalsy();
  });

  it('should call authService logout', () => {
    component.logout();
    
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should not load data if current user is null', () => {
    Object.defineProperty(authService, 'currentUser', { value: null, writable: true });
    
    component.ngOnInit();
    
    expect(adminService.getSummary).not.toHaveBeenCalled();
    expect(policyService.getMyPolicies).not.toHaveBeenCalled();
    expect(claimService.getClaims).not.toHaveBeenCalled();
  });
});
