import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthUser, LoginResponse, RegisterResponse } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:5000/api/v1/auth';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with null user', () => {
    expect(service.currentUser).toBeNull();
  });

  describe('login', () => {
    it('should login user and store token and user data', () => {
      const mockResponse: LoginResponse = {
        message: 'Login successful',
        token: 'mock-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          role: 'customer'
        }
      };

      service.login('test@test.com', 'password123').subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.currentUser).toEqual(mockResponse.user);
        expect(service.token).toBe('mock-token');
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        email: 'test@test.com',
        password: 'password123'
      });
      req.flush(mockResponse);
    });

    it('should handle login error', () => {
      const errorMessage = 'Invalid credentials';
      
      service.login('test@test.com', 'wrongpassword').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush({ message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
    });

    it('should not store data if token is missing', () => {
      const mockResponse = {
        message: 'Login successful',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          role: 'customer'
        }
      };

      service.login('test@test.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush(mockResponse);

      expect(service.token).toBeNull();
      expect(service.currentUser).toBeNull();
    });
  });

  describe('signup', () => {
    it('should register new user', () => {
      const mockResponse: RegisterResponse = {
        message: 'Registration successful',
        user: {
          id: '1',
          name: 'New User',
          email: 'new@test.com',
          role: 'customer'
        }
      };

      service.signup('New User', 'new@test.com', 'password123', 'customer').subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'New User',
        email: 'new@test.com',
        password: 'password123',
        role: 'customer'
      });
      req.flush(mockResponse);
    });

    it('should register with default customer role', () => {
      const mockResponse: RegisterResponse = {
        message: 'Registration successful',
        user: {
          id: '1',
          name: 'New User',
          email: 'new@test.com',
          role: 'customer'
        }
      };

      service.signup('New User', 'new@test.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${baseUrl}/register`);
      expect(req.request.body.role).toBe('customer');
      req.flush(mockResponse);
    });

    it('should handle registration error', () => {
      const errorMessage = 'Email already exists';
      
      service.signup('New User', 'existing@test.com', 'password123').subscribe({
        next: () => fail('Should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}/register`);
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('logout', () => {
    it('should clear stored data and set user to null', () => {
      // First login to set data
      localStorage.setItem('auth_token', 'mock-token');
      localStorage.setItem('auth_user', JSON.stringify({
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'customer'
      }));

      service.logout();

      expect(service.token).toBeNull();
      expect(service.currentUser).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
    });
  });

  describe('token getter', () => {
    it('should return stored token', () => {
      localStorage.setItem('auth_token', 'stored-token');
      expect(service.token).toBe('stored-token');
    });

    it('should return null if no token stored', () => {
      expect(service.token).toBeNull();
    });
  });

  describe('currentUser getter', () => {
    it('should return parsed user from localStorage', () => {
      const mockUser: AuthUser = {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'customer'
      };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      expect(service.currentUser).toEqual(mockUser);
    });

    it('should return null if no user stored', () => {
      expect(service.currentUser).toBeNull();
    });

    it('should return null if invalid JSON stored', () => {
      spyOn(console, 'error');
      localStorage.setItem('auth_user', 'invalid-json');
      expect(service.currentUser).toBeNull();
    });
  });

  describe('user$ observable', () => {
    it('should emit current user on subscription', () => {
      const mockUser: AuthUser = {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'customer'
      };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      let emittedUser: AuthUser | null = null;
      service.user$.subscribe(user => {
        emittedUser = user;
      });

      expect(emittedUser).toEqual(mockUser as any);
    });

    it('should emit null if no user stored', () => {
      localStorage.removeItem('auth_user');
      
      let emittedUser: AuthUser | null = null;
      service.user$.subscribe(user => {
        emittedUser = user;
      });

      expect(emittedUser).toBeNull();
    });
  });

  describe('storage event listener', () => {
    it('should update user when auth_user changes in localStorage', () => {
      const mockUser: AuthUser = {
        id: '1',
        name: 'Updated User',
        email: 'updated@test.com',
        role: 'admin'
      };

      let emittedUser: AuthUser | null = null;
      const subscription = service.user$.subscribe(user => {
        emittedUser = user;
      });

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'auth_user',
        newValue: JSON.stringify(mockUser),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);

      expect(emittedUser).toEqual(mockUser as any);
      subscription.unsubscribe();
    });

    it('should update user when auth_token changes in localStorage', () => {
      const mockUser: AuthUser = {
        id: '1',
        name: 'Test User',
        email: 'test@test.com',
        role: 'customer'
      };
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      let emittedUser: AuthUser | null = null;
      const subscription = service.user$.subscribe(user => {
        emittedUser = user;
      });

      // Simulate storage event
      const storageEvent = new StorageEvent('storage', {
        key: 'auth_token',
        newValue: 'new-token',
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);

      expect(emittedUser).toEqual(mockUser as any);
      subscription.unsubscribe();
    });

    it('should not update user for other storage events', () => {
      let emittedUser: AuthUser | null = null;
      service.user$.subscribe(user => {
        emittedUser = user;
      });

      // Simulate storage event for different key
      const storageEvent = new StorageEvent('storage', {
        key: 'other_key',
        newValue: 'some-value',
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);

      expect(emittedUser).toBeNull();
    });
  });
});
