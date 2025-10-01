import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { Payment } from '../models/payment.model';
import { environment } from '../../environments/environment';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl;

  const mockPayment: Payment = {
    _id: '1',
    userId: 'user1',
    userPolicyId: 'policy1',
    amount: 1000,
    method: 'credit_card',
    reference: 'txn_123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });
    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMyPayments', () => {
    it('should fetch user payments', () => {
      const mockPayments: Payment[] = [mockPayment];

      service.getMyPayments().subscribe(payments => {
        expect(payments).toEqual(mockPayments);
      });

      const req = httpMock.expectOne(`${baseUrl}/payments/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPayments);
    });

    it('should handle error when fetching payments', () => {
      service.getMyPayments().subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/payments/user`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('makePayment', () => {
    it('should make a payment', () => {
      const paymentRequest = {
        userPolicyId: 'policy1',
        method: 'credit_card' as const,
        reference: 'txn_123'
      };

      service.makePayment(paymentRequest).subscribe(payment => {
        expect(payment).toEqual(mockPayment);
      });

      const req = httpMock.expectOne(`${baseUrl}/payments`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(paymentRequest);
      req.flush(mockPayment);
    });

    it('should handle error when making payment', () => {
      const paymentRequest = {
        userPolicyId: 'policy1',
        method: 'credit_card' as const,
        reference: 'txn_123'
      };

      service.makePayment(paymentRequest).subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/payments`);
      req.flush({ message: 'Invalid payment data' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
