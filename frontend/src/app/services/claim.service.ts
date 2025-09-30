import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Claim, SubmitClaimRequest, ReviewClaimRequest } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  constructor(private http: HttpClient) {}

  // Submit a claim (customer)
  submitClaim(request: SubmitClaimRequest): Observable<Claim> {
    return this.http.post<Claim>(`${environment.apiUrl}/claims`, request);
  }

  // Get all claims (role-based)
  getClaims(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${environment.apiUrl}/claims`);
  }

  // Get claim details by ID
  getClaimDetails(id: string): Observable<Claim> {
    return this.http.get<Claim>(`${environment.apiUrl}/claims/${id}`);
  }

  // Review a claim (agent/admin)
  reviewClaim(id: string, request: ReviewClaimRequest): Observable<Claim> {
    return this.http.put<Claim>(`${environment.apiUrl}/claims/${id}/status`, request);
  }
}