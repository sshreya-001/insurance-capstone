import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthUser } from '../services/auth.service';

describe('AuthGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      currentUser: null
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    mockRoute = {
      data: {},
      params: {},
      queryParams: {},
      fragment: null,
      url: [],
      root: {} as ActivatedRouteSnapshot,
      parent: null,
      firstChild: null,
      children: [],
      pathFromRoot: [],
      paramMap: {
        get: (name: string) => null,
        getAll: (name: string) => [],
        has: (name: string) => false,
        keys: []
      },
      queryParamMap: {
        get: (name: string) => null,
        getAll: (name: string) => [],
        has: (name: string) => false,
        keys: []
      },
      outlet: 'primary',
      component: null,
      routeConfig: null,
      title: undefined
    } as ActivatedRouteSnapshot;

    mockState = {
      url: '/test',
      root: {} as ActivatedRouteSnapshot,
      fragment: null,
      queryParams: {},
      params: {},
      data: {},
      paramMap: {
        get: (name: string) => null,
        getAll: (name: string) => [],
        has: (name: string) => false,
        keys: []
      },
      queryParamMap: {
        get: (name: string) => null,
        getAll: (name: string) => [],
        has: (name: string) => false,
        keys: []
      }
    } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should return true when user is authenticated', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'customer'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeTruthy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should redirect to login when user is not authenticated', () => {
    Object.defineProperty(authService, 'currentUser', { value: null, writable: true });

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeFalsy();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  it('should return true when user has required role', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = { role: 'admin' };

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeTruthy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should redirect to user role dashboard when user does not have required role', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Customer User',
      email: 'customer@test.com',
      role: 'customer'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = { role: 'admin' };

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeFalsy();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/customer');
    });
  });

  it('should redirect agent to agent dashboard when accessing admin route', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Agent User',
      email: 'agent@test.com',
      role: 'agent'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = { role: 'admin' };

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeFalsy();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/agent');
    });
  });

  it('should redirect admin to admin dashboard when accessing customer route', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Admin User',
      email: 'admin@test.com',
      role: 'admin'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = { role: 'customer' };

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeFalsy();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
    });
  });

  it('should return true when no role is required', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'customer'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = {};

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeTruthy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should return true when role is undefined', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'customer'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = { role: undefined };

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeTruthy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  it('should handle null route data', () => {
    const mockUser: AuthUser = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
      role: 'customer'
    };
    Object.defineProperty(authService, 'currentUser', { value: mockUser, writable: true });
    mockRoute.data = null as any;

    TestBed.runInInjectionContext(() => {
      const result = authGuard(mockRoute, mockState);
      expect(result).toBeTruthy();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});