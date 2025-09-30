import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, MakePaymentRequest } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  // Make a payment (customer)
  makePayment(request: MakePaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${environment.apiUrl}/payments`, request);
  }

  // Get user's payment history
  getMyPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${environment.apiUrl}/payments/user`);
  }
}