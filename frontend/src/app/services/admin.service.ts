import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuditLog, AdminSummary } from '../models/admin.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  // Get audit logs (admin only)
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${environment.apiUrl}/admin/audit`);
  }

  // Get admin summary (admin only)
  getSummary(): Observable<AdminSummary> {
    return this.http.get<AdminSummary>(`${environment.apiUrl}/admin/summary`);
  }

  // Get all users (admin only)
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`);
  }

  // Delete user (admin only)
  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/users/${userId}`);
  }
}