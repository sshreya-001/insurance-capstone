import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { queryParams: {} }
    });

        await TestBed.configureTestingModule({
          imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
          providers: [
            { provide: AuthService, useValue: authServiceSpy },
            { provide: Router, useValue: routerSpy },
            { provide: ActivatedRoute, useValue: activatedRouteSpy }
          ]
        }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have required validators on form fields', () => {
    const emailControl = component.form.get('email');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.form.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should not submit if form is invalid', () => {
    component.form.patchValue({
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should call authService.login with correct credentials on valid form submission', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'mock-token',
      user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'customer' as const }
    };

    authService.login.and.returnValue(of(mockResponse));
    Object.defineProperty(authService, 'currentUser', { value: mockResponse.user, writable: true });

    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('test@test.com', 'password123');
  });

  it('should set loading to true during login', () => {
    authService.login.and.returnValue(of({} as any));

    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.loading).toBeTruthy();
  });

  it('should navigate to admin dashboard for admin user', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'mock-token',
      user: { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' as const }
    };

    authService.login.and.returnValue(of(mockResponse));
    Object.defineProperty(authService, 'currentUser', { value: mockResponse.user, writable: true });

    component.form.patchValue({
      email: 'admin@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('should navigate to agent dashboard for agent user', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'mock-token',
      user: { id: '1', name: 'Agent', email: 'agent@test.com', role: 'agent' as const }
    };

    authService.login.and.returnValue(of(mockResponse));
    Object.defineProperty(authService, 'currentUser', { value: mockResponse.user, writable: true });

    component.form.patchValue({
      email: 'agent@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/agent');
  });

  it('should navigate to customer dashboard for customer user', () => {
    const mockResponse = {
      message: 'Login successful',
      token: 'mock-token',
      user: { id: '1', name: 'Customer', email: 'customer@test.com', role: 'customer' as const }
    };

    authService.login.and.returnValue(of(mockResponse));
    Object.defineProperty(authService, 'currentUser', { value: mockResponse.user, writable: true });

    component.form.patchValue({
      email: 'customer@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigateByUrl).toHaveBeenCalledWith('/customer');
  });

  it('should handle login error and display error message', () => {
    const errorResponse = {
      error: { message: 'Invalid credentials' }
    };

    authService.login.and.returnValue(throwError(() => errorResponse));

    component.form.patchValue({
      email: 'test@test.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Invalid credentials');
  });

  it('should handle login error without specific message', () => {
    authService.login.and.returnValue(throwError(() => ({})));

    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Login failed');
  });

  it('should clear error when starting new login attempt', () => {
    component.error = 'Previous error';
    authService.login.and.returnValue(of({} as any));

    component.form.patchValue({
      email: 'test@test.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.error).toBeNull();
  });
});
