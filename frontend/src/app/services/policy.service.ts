import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PolicyProduct, UserPolicy, PurchasePolicyRequest } from '../models/policy.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  constructor(private http: HttpClient) {}

  // Get all policy products (public)
  getPolicyProducts(): Observable<PolicyProduct[]> {
    return this.http.get<PolicyProduct[]>(`${environment.apiUrl}/policies`);
  }

  // Purchase a policy (customer)
  purchasePolicy(policyId: string, request: PurchasePolicyRequest): Observable<UserPolicy> {
    return this.http.post<UserPolicy>(`${environment.apiUrl}/policies/${policyId}/purchase`, request);
  }

  // Get user's policies
  getMyPolicies(): Observable<UserPolicy[]> {
    return this.http.get<UserPolicy[]>(`${environment.apiUrl}/user/policies`);
  }

  // Admin: Create policy product
  createPolicyProduct(product: Partial<PolicyProduct>): Observable<PolicyProduct> {
    return this.http.post<PolicyProduct>(`${environment.apiUrl}/policies`, product);
  }

  // Admin: Update policy product
  updatePolicyProduct(id: string, product: Partial<PolicyProduct>): Observable<PolicyProduct> {
    return this.http.put<PolicyProduct>(`${environment.apiUrl}/policies/${id}`, product);
  }

  // Admin: Delete policy product
  deletePolicyProduct(id: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/policies/${id}`);
  }
}