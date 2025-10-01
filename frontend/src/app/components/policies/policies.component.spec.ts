import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { PoliciesComponent } from './policies.component';
import { PolicyService } from '../../services/policy.service';
import { PolicyProduct } from '../../models/policy.model';

describe('PoliciesComponent', () => {
  let component: PoliciesComponent;
  let fixture: ComponentFixture<PoliciesComponent>;
  let policyService: jasmine.SpyObj<PolicyService>;

  const mockPolicies: PolicyProduct[] = [
    {
      _id: '1',
      code: 'HI001',
      title: 'Health Insurance',
      description: 'Comprehensive health coverage',
      premium: 1000,
      termMonths: 12,
      minSumInsured: 500000
    },
    {
      _id: '2',
      code: 'LI001',
      title: 'Life Insurance',
      description: 'Life coverage policy',
      premium: 2000,
      termMonths: 24,
      minSumInsured: 1000000
    }
  ];

  beforeEach(async () => {
    const policyServiceSpy = jasmine.createSpyObj('PolicyService', ['getPolicyProducts']);

    await TestBed.configureTestingModule({
      imports: [PoliciesComponent, HttpClientTestingModule],
      providers: [
        { provide: PolicyService, useValue: policyServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoliciesComponent);
    component = fixture.componentInstance;
    policyService = TestBed.inject(PolicyService) as jasmine.SpyObj<PolicyService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty policies array', () => {
    expect(component.policies).toEqual([]);
  });

  it('should initialize with loading true', () => {
    expect(component.loading).toBeTruthy();
  });

  it('should load policies on init', () => {
    policyService.getPolicyProducts.and.returnValue(of(mockPolicies));

    component.ngOnInit();

    expect(policyService.getPolicyProducts).toHaveBeenCalled();
  });

  it('should set policies and loading false on successful load', () => {
    policyService.getPolicyProducts.and.returnValue(of(mockPolicies));

    component.ngOnInit();

    expect(component.policies).toEqual(mockPolicies);
    expect(component.loading).toBeFalsy();
  });

  it('should handle error when loading policies', () => {
    policyService.getPolicyProducts.and.returnValue(throwError(() => new Error('Load error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalledWith('Error loading policies:', jasmine.any(Error));
    expect(component.loading).toBeFalsy();
  });

});
