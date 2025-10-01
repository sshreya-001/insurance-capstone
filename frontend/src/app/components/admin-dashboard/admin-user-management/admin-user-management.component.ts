import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AdminService } from '../../../services/admin.service';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'customer';
  createdAt: string;
  isActive: boolean;
}

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">User Management</h3>
        <div class="flex space-x-2">
          <select 
            [(ngModel)]="selectedRole" 
            (change)="filterUsers()" 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Users</option>
            <option value="admin">Admins</option>
            <option value="agent">Agents</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Loading users...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error && !loading" class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div class="text-red-500 mb-2">
          <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-700">{{ error }}</h3>
        <button (click)="loadUsers()" class="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          Try Again
        </button>
      </div>

      <!-- Enhanced Users Table -->
      <div *ngIf="!loading && !error" class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">User Management</h3>
          <p class="text-sm text-gray-600 mt-1">Manage all users in the system</p>
        </div>
        <div class="overflow-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
              <tr>
                <th class="py-4 px-6 font-semibold text-gray-800">User</th>
                <th class="py-4 px-6 font-semibold text-gray-800">Email</th>
                <th class="py-4 px-6 font-semibold text-gray-800">Role</th>
                <th class="py-4 px-6 font-semibold text-gray-800">Joined</th>
                <th class="py-4 px-6 font-semibold text-gray-800">Status</th>
                <th class="py-4 px-6 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr *ngIf="filteredUsers.length === 0">
                <td colspan="6" class="py-12 px-6 text-center">
                  <div class="text-gray-400 mb-2">
                    <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 class="text-lg font-medium text-gray-700">No users found</h3>
                  <p class="text-gray-500">Try adjusting your filter criteria</p>
                </td>
              </tr>
              <tr *ngFor="let user of filteredUsers" class="hover:bg-gray-50/50 transition-colors duration-200">
                <td class="py-4 px-6">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span class="text-white font-semibold text-sm">{{ user.name.charAt(0) }}</span>
                    </div>
                    <div class="ml-4">
                      <div class="font-semibold text-gray-900">{{ user.name }}</div>
                      <div class="text-sm text-gray-500">ID: {{ user._id.substring(0, 8) }}...</div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6">
                  <div class="text-gray-900 font-medium">{{ user.email }}</div>
                </td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        [class]="getRoleBadgeClass(user.role)">
                    {{ user.role | titlecase }}
                  </span>
                </td>
                <td class="py-4 px-6 text-gray-600">{{ user.createdAt | date:'MMM dd, yyyy' }}</td>
                <td class="py-4 px-6">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        [class]="user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'">
                    <div class="w-2 h-2 rounded-full mr-2" [class]="user.isActive ? 'bg-emerald-500' : 'bg-red-500'"></div>
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex space-x-2">
                    <button 
                      (click)="toggleUserStatus(user)" 
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                      </svg>
                      {{ user.isActive ? 'Deactivate' : 'Activate' }}
                    </button>
                    <button 
                      (click)="viewUserDetails(user)" 
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View
                    </button>
                    <button 
                      (click)="confirmDeleteUser(user)" 
                      class="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      [disabled]="isCurrentUser(user)">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- User Details Modal -->
      <div *ngIf="selectedUser" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700">User Details</h3>
          </div>
          
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <p class="mt-1 text-gray-900">{{ selectedUser.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <p class="mt-1 text-gray-900">{{ selectedUser.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Role</label>
                <p class="mt-1 text-gray-900">{{ selectedUser.role | titlecase }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <p class="mt-1 text-gray-900">{{ selectedUser.isActive ? 'Active' : 'Inactive' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Joined</label>
                <p class="mt-1 text-gray-900">{{ selectedUser.createdAt | date:'medium' }}</p>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              (click)="closeUserDetails()" 
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Delete Confirmation Modal -->
      <div *ngIf="userToDelete" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[55] p-4">
        <div class="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-lg w-full border border-white/20">
          <div class="px-8 py-6 border-b border-gray-200/50">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 class="text-xl font-bold text-gray-900">Confirm User Deletion</h3>
                <p class="text-sm text-gray-600 mt-1">This action cannot be undone</p>
              </div>
            </div>
          </div>
          
          <div class="px-8 py-6">
            <div class="mb-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4">Are you sure you want to delete this user?</h4>
              
              <!-- User Info Card -->
              <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div class="flex items-center mb-3">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-semibold text-sm">{{ userToDelete.name.charAt(0) }}</span>
                  </div>
                  <div class="ml-3">
                    <div class="font-semibold text-gray-900">{{ userToDelete.name }}</div>
                    <div class="text-sm text-gray-500">{{ userToDelete.email }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                        [class]="getRoleBadgeClass(userToDelete.role)">
                    {{ userToDelete.role | titlecase }}
                  </span>
                  <span class="text-sm text-gray-500">Joined {{ userToDelete.createdAt | date:'MMM dd, yyyy' }}</span>
                </div>
              </div>
              
              <!-- Warning Message -->
              <div class="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-red-500 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <div>
                    <h5 class="text-sm font-semibold text-red-800 mb-1">Permanent Data Loss</h5>
                    <p class="text-sm text-red-700">All user data including policies, payments, and claims will be permanently deleted and cannot be recovered.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-8 py-6 border-t border-gray-200/50 bg-gray-50/50 rounded-b-2xl">
            <div class="flex justify-end space-x-3">
              <button 
                (click)="cancelDelete()" 
                class="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200 hover:scale-105">
                Cancel
              </button>
              <button 
                (click)="deleteUser()" 
                [disabled]="deleting"
                class="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105 disabled:transform-none">
                <span *ngIf="deleting" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                {{ deleting ? 'Deleting...' : 'Delete User' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminUserManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private adminService = inject(AdminService);

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User | null = null;
  userToDelete: User | null = null;
  selectedRole = '';
  loading = false;
  deleting = false;
  error: string | null = null;
  currentUserId: string | null = null;

  ngOnInit(): void {
    this.loadUsers();
    // Get current user ID from localStorage or auth service
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.currentUserId = JSON.parse(currentUser).id;
    }
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.adminService.getUsers().subscribe({
      next: (users: any[]) => {
        this.users = users.map((user: any) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          isActive: true // Default to active, you can add isActive field to User model if needed
        }));
        this.filteredUsers = [...this.users];
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users. Please try again.';
        this.users = [];
        this.filteredUsers = [];
        this.loading = false;
      }
    });
  }

  filterUsers(): void {
    if (this.selectedRole) {
      this.filteredUsers = this.users.filter(user => user.role === this.selectedRole);
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  toggleUserStatus(user: User): void {
    user.isActive = !user.isActive;
    // In a real app, you'd make an API call here
    console.log('User status toggled:', user);
  }

  viewUserDetails(user: User): void {
    this.selectedUser = user;
  }

  closeUserDetails(): void {
    this.selectedUser = null;
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'agent':
        return 'bg-blue-100 text-blue-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  isCurrentUser(user: User): boolean {
    return this.currentUserId === user._id;
  }

  confirmDeleteUser(user: User): void {
    this.userToDelete = user;
  }

  cancelDelete(): void {
    this.userToDelete = null;
  }

  deleteUser(): void {
    if (!this.userToDelete) return;

    this.deleting = true;
    this.adminService.deleteUser(this.userToDelete._id).subscribe({
      next: (response: any) => {
        this.deleting = false;
        this.userToDelete = null;
        this.loadUsers(); // Refresh the user list
        alert('User deleted successfully!');
      },
      error: (error: any) => {
        this.deleting = false;
        console.error('Error deleting user:', error);
        alert('Error deleting user: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }
}
