import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['signup']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('role')?.value).toBe('customer');
  });

  it('should have required validators on form fields', () => {
    const nameControl = component.registerForm.get('name');
    const emailControl = component.registerForm.get('email');
    const passwordControl = component.registerForm.get('password');
    const roleControl = component.registerForm.get('role');

    nameControl?.setValue('');
    emailControl?.setValue('');
    passwordControl?.setValue('');
    roleControl?.setValue('');

    expect(nameControl?.hasError('required')).toBeTruthy();
    expect(emailControl?.hasError('required')).toBeTruthy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
    expect(roleControl?.hasError('required')).toBeTruthy();
  });

  it('should validate name minimum length', () => {
    const nameControl = component.registerForm.get('name');
    
    nameControl?.setValue('A');
    expect(nameControl?.hasError('minlength')).toBeTruthy();

    nameControl?.setValue('John');
    expect(nameControl?.hasError('minlength')).toBeFalsy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');
    
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.registerForm.get('password');
    
    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.hasError('minlength')).toBeFalsy();
  });

  it('should not submit if form is invalid', () => {
    component.registerForm.patchValue({
      name: '',
      email: '',
      password: '',
      role: ''
    });

    component.onSubmit();

    expect(authService.signup).not.toHaveBeenCalled();
  });

  it('should call authService.register with form data on valid form submission', () => {
    const mockResponse = {
      message: 'Registration successful',
      user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'customer' as const }
    };

    authService.signup.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'customer'
    });

    component.onSubmit();

    expect(authService.signup).toHaveBeenCalledWith(
      'Test User',
      'test@test.com',
      'password123',
      'customer'
    );
  });

  it('should set loading to true during registration', () => {
    // Create a delayed observable to test loading state
    authService.signup.and.returnValue(new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next({} as any);
        subscriber.complete();
      }, 100);
    }));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'customer'
    });

    component.onSubmit();

    // Check loading state immediately after onSubmit
    expect(component.loading).toBeTruthy();
  });

  it('should navigate to dashboard on successful registration', () => {
    const mockResponse = {
      message: 'Registration successful',
      user: { id: '1', name: 'Test User', email: 'test@test.com', role: 'customer' as const }
    };

    authService.signup.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'customer'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle registration error and display error message', () => {
    const errorResponse = {
      error: { message: 'Email already exists' }
    };

    authService.signup.and.returnValue(throwError(() => errorResponse));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'customer'
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Email already exists');
  });

  it('should handle registration error without specific message', () => {
    authService.signup.and.returnValue(throwError(() => ({})));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'customer'
    });

    component.onSubmit();

    expect(component.loading).toBeFalsy();
    expect(component.error).toBe('Registration failed');
  });

  it('should clear error when starting new registration attempt', () => {
    component.error = 'Previous error';
    authService.signup.and.returnValue(of({} as any));

    component.registerForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: 'password123',
      role: 'customer'
    });

    component.onSubmit();

    expect(component.error).toBe('');
  });
});
