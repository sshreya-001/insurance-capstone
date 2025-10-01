import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClaimService } from './claim.service';
import { Claim } from '../models/claim.model';
import { environment } from '../../environments/environment';

describe('ClaimService', () => {
  let service: ClaimService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  const mockUser = {
    id: 'user1',
    name: 'Test User',
    email: 'test@test.com',
    role: 'customer' as const
  };

  const mockUserPolicy = {
    _id: 'policy1',
    userId: 'user1',
    policyProductId: {
      _id: 'prod1',
      code: 'HI001',
      title: 'Health Insurance',
      description: 'Health coverage',
      premium: 1000,
      termMonths: 12,
      minSumInsured: 500000
    },
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    premiumPaid: 1000,
    status: 'ACTIVE' as const,
    nominee: { name: 'John Doe', relation: 'Spouse' }
  };

  const mockClaim: Claim = {
    _id: '1',
    userId: mockUser,
    userPolicyId: mockUserPolicy,
    incidentDate: new Date('2024-01-15'),
    description: 'Medical claim',
    amountClaimed: 5000,
    status: 'PENDING'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClaimService]
    });
    service = TestBed.inject(ClaimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getClaims', () => {
    it('should fetch all claims', () => {
      const mockClaims: Claim[] = [mockClaim];

      service.getClaims().subscribe(claims => {
        expect(claims).toEqual(mockClaims);
      });

      const req = httpMock.expectOne(`${baseUrl}/claims`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClaims);
    });

    it('should handle error when fetching claims', () => {
      service.getClaims().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/claims`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getClaimDetails', () => {
    it('should fetch claim details by id', () => {
      service.getClaimDetails('1').subscribe(claim => {
        expect(claim).toEqual(mockClaim);
      });

      const req = httpMock.expectOne(`${baseUrl}/claims/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockClaim);
    });

    it('should handle error when fetching claim details', () => {
      service.getClaimDetails('1').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/claims/1`);
      req.flush({ message: 'Claim not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('submitClaim', () => {
    it('should submit a new claim', () => {
      const submitRequest = {
        userPolicyId: 'policy1',
        incidentDate: new Date('2024-01-15'),
        description: 'Medical claim',
        amountClaimed: 5000
      };

      service.submitClaim(submitRequest).subscribe(claim => {
        expect(claim).toEqual(mockClaim);
      });

      const req = httpMock.expectOne(`${baseUrl}/claims`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(submitRequest);
      req.flush(mockClaim);
    });

    it('should handle error when submitting claim', () => {
      const submitRequest = {
        userPolicyId: 'policy1',
        incidentDate: new Date('2024-01-15'),
        description: 'Medical claim',
        amountClaimed: 5000
      };

      service.submitClaim(submitRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/claims`);
      req.flush({ message: 'Invalid claim data' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('reviewClaim', () => {
    it('should review a claim', () => {
      const reviewRequest = {
        status: 'APPROVED' as const,
        notes: 'Approved after review'
      };

      const resultClaim = { ...mockClaim, status: 'APPROVED' as const, decisionNotes: 'Approved after review' };

      service.reviewClaim('1', reviewRequest).subscribe(claim => {
        expect(claim).toEqual(resultClaim);
      });

      const req = httpMock.expectOne(`${baseUrl}/claims/1/status`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(reviewRequest);
      req.flush(resultClaim);
    });

    it('should handle error when reviewing claim', () => {
      const reviewRequest = {
        status: 'APPROVED' as const,
        notes: 'Approved after review'
      };

      service.reviewClaim('1', reviewRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/claims/1/status`);
      req.flush({ message: 'Claim not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
