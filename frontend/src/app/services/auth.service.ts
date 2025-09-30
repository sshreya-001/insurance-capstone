import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  // Consider moving to environment file or dev proxy
  private readonly baseUrl = 'http://localhost:5000/api/v1/auth';

  private userSubject = new BehaviorSubject<AuthUser | null>(null);
  readonly user$ = this.userSubject.asObservable();

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res?.token) {
            localStorage.setItem('auth_token', res.token);
            localStorage.setItem('auth_user', JSON.stringify(res.user));
            this.userSubject.next(res.user);
          }
        })
      );
  }

  signup(name: string, email: string, password: string, role: 'customer' | 'agent' | 'admin' = 'customer'): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.baseUrl}/register`, {
      name,
      email,
      password,
      role,
    });
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    this.userSubject.next(null);
  }

  get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  get currentUser(): AuthUser | null {
    const raw = localStorage.getItem('auth_user');
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }

  constructor() {
    // Initialize subject from storage on app start
    this.userSubject.next(this.currentUser);
    // Listen to other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'auth_user' || e.key === 'auth_token') {
        this.userSubject.next(this.currentUser);
      }
    });
  }
}


