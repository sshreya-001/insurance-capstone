import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolicyService } from './policy.service';
import { PolicyProduct, UserPolicy, PurchasePolicyRequest } from '../models/policy.model';
import { environment } from '../../environments/environment';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PolicyService]
    });
    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPolicyProducts', () => {
    it('should fetch all policy products', () => {
      const mockProducts: PolicyProduct[] = [
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

      service.getPolicyProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${baseUrl}/policies`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle error when fetching policy products', () => {
      service.getPolicyProducts().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/policies`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('purchasePolicy', () => {
    it('should purchase a policy', () => {
      const mockUserPolicy: UserPolicy = {
        _id: '1',
        userId: 'user1',
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
      };

      const purchaseRequest: PurchasePolicyRequest = {
        termMonths: 12,
        nominee: {
          name: 'John Doe',
          relation: 'Spouse'
        }
      };

      service.purchasePolicy('policy1', purchaseRequest).subscribe(userPolicy => {
        expect(userPolicy).toEqual(mockUserPolicy);
      });

      const req = httpMock.expectOne(`${baseUrl}/policies/policy1/purchase`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(purchaseRequest);
      req.flush(mockUserPolicy);
    });

    it('should handle error when purchasing policy', () => {
      const purchaseRequest: PurchasePolicyRequest = {
        termMonths: 12,
        nominee: {
          name: 'John Doe',
          relation: 'Spouse'
        }
      };

      service.purchasePolicy('policy1', purchaseRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/policies/policy1/purchase`);
      req.flush({ message: 'Invalid policy' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getMyPolicies', () => {
    it('should fetch user policies', () => {
      const mockUserPolicies: UserPolicy[] = [
        {
          _id: '1',
          userId: 'user1',
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

      service.getMyPolicies().subscribe(policies => {
        expect(policies).toEqual(mockUserPolicies);
      });

      const req = httpMock.expectOne(`${baseUrl}/user/policies`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserPolicies);
    });

    it('should handle error when fetching user policies', () => {
      service.getMyPolicies().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/user/policies`);
      req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('createPolicyProduct', () => {
    it('should create a new policy product', () => {
      const newProduct: Partial<PolicyProduct> = {
        code: 'NI001',
        title: 'New Insurance',
        description: 'New insurance product',
        premium: 1500,
        termMonths: 12,
        minSumInsured: 750000
      };

      const createdProduct: PolicyProduct = {
        _id: '3',
        code: 'NI001',
        title: 'New Insurance',
        description: 'New insurance product',
        premium: 1500,
        termMonths: 12,
        minSumInsured: 750000
      };

      service.createPolicyProduct(newProduct).subscribe(product => {
        expect(product).toEqual(createdProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/policies`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProduct);
      req.flush(createdProduct);
    });

    it('should handle error when creating policy product', () => {
      const newProduct: Partial<PolicyProduct> = {
        code: 'NI001',
        title: 'New Insurance',
        description: 'New insurance product'
      };

      service.createPolicyProduct(newProduct).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/policies`);
      req.flush({ message: 'Validation error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updatePolicyProduct', () => {
    it('should update an existing policy product', () => {
      const updatedProduct: Partial<PolicyProduct> = {
        title: 'Updated Insurance',
        premium: 2000
      };

      const resultProduct: PolicyProduct = {
        _id: '1',
        code: 'HI001',
        title: 'Updated Insurance',
        description: 'Comprehensive health coverage',
        premium: 2000,
        termMonths: 12,
        minSumInsured: 500000
      };

      service.updatePolicyProduct('1', updatedProduct).subscribe(product => {
        expect(product).toEqual(resultProduct);
      });

      const req = httpMock.expectOne(`${baseUrl}/policies/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedProduct);
      req.flush(resultProduct);
    });

    it('should handle error when updating policy product', () => {
      const updatedProduct: Partial<PolicyProduct> = {
        title: 'Updated Insurance'
      };

      service.updatePolicyProduct('1', updatedProduct).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/policies/1`);
      req.flush({ message: 'Policy not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePolicyProduct', () => {
    it('should delete a policy product', () => {
      service.deletePolicyProduct('1').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${baseUrl}/policies/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ message: 'Policy deleted successfully' });
    });

    it('should handle error when deleting policy product', () => {
      service.deletePolicyProduct('1').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/policies/1`);
      req.flush({ message: 'Policy not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
