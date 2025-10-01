import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center space-x-2 group">
          <div class="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
            Insurance Portal
          </span>
        </a>

               <!-- Desktop Navigation -->
               <nav class="hidden md:flex items-center space-x-8">
                 <!-- Show Home for everyone -->
                 <a routerLink="/" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                   Home
                   <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                 </a>
                 
                 <!-- Public pages for everyone -->
                 <a routerLink="/about" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                   About
                   <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                 </a>
                 <a routerLink="/policies" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                   Policies
                   <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                 </a>
                 <a routerLink="/services" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                   Services
                   <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                 </a>
                 <a routerLink="/statistics" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                   Statistics
                   <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                 </a>
                 <a routerLink="/contact" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                   Contact
                   <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                 </a>
                 
                 <!-- Create Policy - Visible to everyone but styled differently for admin -->
                 <a routerLink="/create-policy" 
                    [class]="(auth.user$ | async)?.role === 'admin' ? 
                      'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl' : 
                      'text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group'">
                   <span *ngIf="(auth.user$ | async)?.role !== 'admin'" class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                   <span class="flex items-center">
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                     </svg>
                     Create Policy
                   </span>
                 </a>
          
          <!-- Show Login/Signup when NOT logged in -->
          <ng-container *ngIf="!(auth.user$ | async)">
            <a routerLink="/login" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
              Login
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a routerLink="/signup" class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </a>
          </ng-container>
          
          <!-- Show role-specific navigation when logged in -->
          <ng-container *ngIf="(auth.user$ | async) as user">
            <!-- Admin Navigation -->
            <ng-container *ngIf="user.role === 'admin'">
              <a routerLink="/admin" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Admin Dashboard
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </ng-container>
            
            <!-- Agent Navigation -->
            <ng-container *ngIf="user.role === 'agent'">
              <a routerLink="/agent" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Agent Dashboard
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </ng-container>
            
            <!-- Customer Navigation -->
            <ng-container *ngIf="user.role === 'customer'">
              <a routerLink="/customer" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Dashboard
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a routerLink="/customer/policies" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                My Policies
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a routerLink="/customer/claims" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Claims
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a routerLink="/customer/payments" class="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative group">
                Payments
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </a>
            </ng-container>
            
            <!-- User Menu -->
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2 text-sm text-gray-600">
                <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold text-xs">{{ user.name.charAt(0) || 'U' }}</span>
                </div>
                <span class="font-medium">{{ user.name || 'User' }}</span>
              </div>
              <button (click)="logout()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md">
                Logout
              </button>
            </div>
          </ng-container>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors" (click)="toggleMobileMenu()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

             <!-- Mobile Menu -->
             <div *ngIf="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-200 shadow-lg">
               <div class="px-4 py-6 space-y-4">
                 <a routerLink="/" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Home</a>
                 <a routerLink="/about" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">About</a>
                 <a routerLink="/policies" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Policies</a>
                 <a routerLink="/services" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Services</a>
                 <a routerLink="/statistics" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Statistics</a>
                 <a routerLink="/contact" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Contact</a>
                 <a routerLink="/create-policy" 
                    [class]="(auth.user$ | async)?.role === 'admin' ? 
                      'block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-center' : 
                      'block text-gray-600 hover:text-gray-900 font-medium py-2'" 
                    (click)="closeMobileMenu()">
                   <span class="flex items-center justify-center">
                     <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                     </svg>
                     Create Policy
                   </span>
                 </a>
          
          <ng-container *ngIf="!(auth.user$ | async)">
            <a routerLink="/login" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Login</a>
            <a routerLink="/signup" class="block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold text-center" (click)="closeMobileMenu()">Get Started</a>
          </ng-container>
          
          <ng-container *ngIf="(auth.user$ | async) as user">
            <ng-container *ngIf="user.role === 'admin'">
              <a routerLink="/admin" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Admin Dashboard</a>
            </ng-container>
            <ng-container *ngIf="user.role === 'agent'">
              <a routerLink="/agent" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Agent Dashboard</a>
            </ng-container>
            <ng-container *ngIf="user.role === 'customer'">
              <a routerLink="/customer" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Dashboard</a>
              <a routerLink="/customer/policies" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">My Policies</a>
              <a routerLink="/customer/claims" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Claims</a>
              <a routerLink="/customer/payments" class="block text-gray-600 hover:text-gray-900 font-medium py-2" (click)="closeMobileMenu()">Payments</a>
            </ng-container>
            <div class="pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-3 mb-4">
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span class="text-white font-semibold">{{ user.name.charAt(0) || 'U' }}</span>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ user.name || 'User' }}</div>
                  <div class="text-sm text-gray-500 capitalize">{{ user.role }}</div>
                </div>
              </div>
              <button (click)="logout(); closeMobileMenu()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                Logout
              </button>
            </div>
          </ng-container>
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent {
  auth = inject(AuthService);
  mobileMenuOpen = false;

  logout() { 
    this.auth.logout(); 
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}




