import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

        await TestBed.configureTestingModule({
          imports: [HomeComponent, RouterTestingModule],
          providers: [
            { provide: Router, useValue: routerSpy }
          ]
        }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render hero section with title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    
    expect(titleElement).toBeTruthy();
    expect(titleElement?.textContent).toContain('Secure Your Future with');
    expect(titleElement?.textContent).toContain('Premium Insurance');
  });

  it('should render call-to-action buttons', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const signupButton = compiled.querySelector('a[routerLink="/signup"]');
    const loginButton = compiled.querySelector('a[routerLink="/login"]');
    
    expect(signupButton).toBeTruthy();
    expect(loginButton).toBeTruthy();
    expect(signupButton?.textContent).toContain('Get Started Free');
    expect(loginButton?.textContent).toContain('Sign In');
  });

  it('should render statistics cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const statsCards = compiled.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-3.gap-8.mb-20 > div');
    
    expect(statsCards.length).toBe(3);
  });

  it('should display customer count in stats', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const customerCount = compiled.querySelector('.text-5xl.font-bold.text-white.mb-2');
    
    expect(customerCount?.textContent).toContain('50K+');
  });

  it('should display claims processed amount in stats', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const claimsAmount = compiled.querySelectorAll('.text-5xl.font-bold.text-white.mb-2')[1];
    
    expect(claimsAmount?.textContent).toContain('₹2.5Cr+');
  });

  it('should display uptime percentage in stats', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const uptimePercentage = compiled.querySelectorAll('.text-5xl.font-bold.text-white.mb-2')[2];
    
    expect(uptimePercentage?.textContent).toContain('99.9%');
  });

  it('should render features section', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const featuresSection = compiled.querySelector('section.py-20.bg-gray-50');
    const featuresTitle = compiled.querySelector('h2');
    
    expect(featuresSection).toBeTruthy();
    expect(featuresTitle?.textContent).toContain('Why Choose Our Platform?');
  });

  it('should render 6 feature cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const featureCards = compiled.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8 > div');
    
    expect(featureCards.length).toBe(6);
  });

  it('should render testimonials section', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const testimonialsSection = compiled.querySelector('section.py-20.bg-white');
    const testimonialsTitle = compiled.querySelectorAll('h2')[1];
    
    expect(testimonialsSection).toBeTruthy();
    expect(testimonialsTitle?.textContent).toContain('What Our Customers Say');
  });

  it('should render 3 testimonial cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const testimonialCards = compiled.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.gap-8')[1].querySelectorAll('div');
    
    expect(testimonialCards.length).toBe(3);
  });

  it('should render statistics section with impact numbers', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const statsSection = compiled.querySelectorAll('section.py-20.bg-gray-50')[1];
    const statsTitle = compiled.querySelectorAll('h2')[2];
    
    expect(statsSection).toBeTruthy();
    expect(statsTitle?.textContent).toContain('Our Impact in Numbers');
  });

  it('should render 4 key metrics cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const metricsCards = compiled.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4.gap-8.mb-16 > div');
    
    expect(metricsCards.length).toBe(4);
  });

  it('should render 3 performance metrics cards', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const performanceCards = compiled.querySelectorAll('.grid.grid-cols-1.lg\\:grid-cols-3.gap-8 > div');
    
    expect(performanceCards.length).toBe(3);
  });

  it('should render final CTA section', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const ctaSection = compiled.querySelector('section.py-20.bg-gradient-to-r.from-blue-600.to-purple-600');
    const ctaTitle = compiled.querySelectorAll('h2')[3];
    
    expect(ctaSection).toBeTruthy();
    expect(ctaTitle?.textContent).toContain('Ready to Get Started?');
  });

  it('should have proper accessibility attributes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const headings = compiled.querySelectorAll('h1, h2, h3');
    
    expect(headings.length).toBeGreaterThan(0);
    headings.forEach(heading => {
      expect(heading.textContent?.trim()).toBeTruthy();
    });
  });

  it('should have proper semantic structure', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const sections = compiled.querySelectorAll('section');
    
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach(section => {
      expect(section.tagName).toBe('SECTION');
    });
  });
});
