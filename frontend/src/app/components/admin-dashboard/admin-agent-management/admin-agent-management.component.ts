import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface Agent {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  policiesSold?: number;
  customersCount?: number;
}

@Component({
  selector: 'app-admin-agent-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-800">Agent Management</h3>
        <div class="flex space-x-3">
          <button 
            (click)="openAssignmentModal()" 
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            Assign Policies
          </button>
          <button 
            (click)="openCreateAgentModal()" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Add New Agent
          </button>
        </div>
      </div>

      <!-- Unassigned Policies Section -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-lg font-semibold text-gray-800">Unassigned Policies</h4>
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {{ unassignedPolicies.length }} pending
            </span>
            <button 
              (click)="loadUnassignedPolicies()" 
              class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Refresh
            </button>
          </div>
        </div>
        <div *ngIf="unassignedPolicies.length === 0" class="text-center py-8">
          <div class="text-gray-400 mb-2">
            <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p class="text-gray-500">No unassigned policies</p>
        </div>
        <div *ngIf="unassignedPolicies.length > 0" class="overflow-auto">
          <table class="min-w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-700">
              <tr>
                <th class="py-3 px-4 font-medium">
                  <input type="checkbox" (change)="toggleSelectAll()" [checked]="allSelected" class="rounded border-gray-300">
                </th>
                <th class="py-3 px-4 font-medium">Policy</th>
                <th class="py-3 px-4 font-medium">Customer</th>
                <th class="py-3 px-4 font-medium">Premium</th>
                <th class="py-3 px-4 font-medium">Purchased</th>
                <th class="py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let policy of unassignedPolicies" class="border-t border-gray-200 hover:bg-gray-50">
                <td class="py-3 px-4">
                  <input type="checkbox" [(ngModel)]="policy.selected" (change)="updateSelection()" class="rounded border-gray-300">
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-gray-800">{{ policy?.policyProductId?.title || 'Unknown Policy' }}</div>
                  <div class="text-gray-600 text-sm">{{ policy?.policyProductId?.code || 'N/A' }}</div>
                </td>
                <td class="py-3 px-4">
                  <div class="font-medium text-gray-800">{{ policy?.userId?.name || 'Unknown Customer' }}</div>
                  <div class="text-gray-600 text-sm">{{ policy?.userId?.email || 'N/A' }}</div>
                </td>
                <td class="py-3 px-4 font-medium text-gray-700">{{ formatCurrency(policy?.premiumPaid || 0) }}</td>
                <td class="py-3 px-4 text-gray-600">{{ policy?.createdAt | date:'short' }}</td>
                <td class="py-3 px-4">
                  <button 
                    (click)="openAssignPolicyModal(policy)" 
                    class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Assign Agent
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bulk Assignment Section -->
        <div *ngIf="unassignedPolicies.length > 0 && selectedPolicies.length > 0" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-sm font-medium text-blue-800">
                {{ selectedPolicies.length }} policy(ies) selected
              </span>
              <select 
                [(ngModel)]="bulkSelectedAgent" 
                class="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Select agent for bulk assignment...</option>
                <option *ngFor="let agent of agents" [value]="agent._id">
                  {{ agent.name }} ({{ agent.email }}) - {{ agent.policiesSold || 0 }} policies
                </option>
              </select>
            </div>
            <div class="flex space-x-2">
              <button 
                (click)="clearSelection()" 
                class="px-3 py-2 text-gray-600 hover:text-gray-700 text-sm font-medium">
                Clear Selection
              </button>
              <button 
                (click)="bulkAssignPolicies()" 
                [disabled]="!bulkSelectedAgent"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors">
                Assign Selected
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Agents Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let agent of agents" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h4 class="font-semibold text-gray-800">{{ agent.name }}</h4>
              <p class="text-gray-600 text-sm">{{ agent.email }}</p>
            </div>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
              {{ agent.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ agent.policiesSold || 0 }}</div>
              <div class="text-gray-600 text-sm">Policies Sold</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ agent.customersCount || 0 }}</div>
              <div class="text-gray-600 text-sm">Customers</div>
            </div>
          </div>

          <div class="flex space-x-2">
            <button 
              (click)="viewAgentDetails(agent)" 
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              View Details
            </button>
            <button 
              (click)="toggleAgentStatus(agent)" 
              class="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
              {{ agent.isActive ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Agent Details Modal -->
      <div *ngIf="selectedAgent" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700">Agent Details</h3>
          </div>
          
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-800 mb-3">Basic Information</h4>
                <div class="space-y-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Name</label>
                    <p class="text-gray-900">{{ selectedAgent.name }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Email</label>
                    <p class="text-gray-900">{{ selectedAgent.email }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Status</label>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [class]="selectedAgent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ selectedAgent.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="font-medium text-gray-800 mb-3">Performance</h4>
                <div class="space-y-2">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Policies Sold</label>
                    <p class="text-gray-900 text-2xl font-bold">{{ selectedAgent.policiesSold || 0 }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Customers</label>
                    <p class="text-gray-900 text-2xl font-bold">{{ selectedAgent.customersCount || 0 }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Joined</label>
                    <p class="text-gray-900">{{ selectedAgent.createdAt | date:'mediumDate' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              (click)="closeAgentDetails()" 
              class="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium">
              Close
            </button>
            <button 
              (click)="toggleAgentStatus(selectedAgent)" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              {{ selectedAgent.isActive ? 'Deactivate' : 'Activate' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Create Agent Modal -->
      <div *ngIf="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700">Add New Agent</h3>
          </div>
          
          <form (ngSubmit)="createAgent()" class="px-6 py-4">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="newAgent.name" 
                  name="name"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  [(ngModel)]="newAgent.email" 
                  name="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  [(ngModel)]="newAgent.password" 
                  name="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              </div>
            </div>

            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button" 
                (click)="closeCreateModal()" 
                class="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium">
                Cancel
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                Create Agent
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Policy Assignment Modal -->
      <div *ngIf="showAssignmentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
        <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700">Assign Policies to Agents</h3>
          </div>
          
          <div class="px-6 py-4">
            <!-- Unassigned Policies -->
            <div class="mb-6">
              <h4 class="font-medium text-gray-800 mb-3">Unassigned Policies</h4>
              <div *ngIf="unassignedPolicies.length === 0" class="text-center py-8 text-gray-500">
                <p>No unassigned policies found.</p>
              </div>
              <div *ngIf="unassignedPolicies.length > 0" class="space-y-2 max-h-60 overflow-y-auto">
                <div *ngFor="let policy of unassignedPolicies" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex-1">
                    <div class="font-medium text-gray-800">{{ policy.policyProductId?.title || 'Unknown Policy' }}</div>
                    <div class="text-sm text-gray-600">
                      Customer: {{ policy.userId?.name || 'Unknown' }} ({{ policy.userId?.email || 'N/A' }})
                    </div>
                    <div class="text-sm text-gray-500">
                      Premium: {{ formatCurrency(policy.premiumPaid) }} | Status: {{ policy.status }}
                    </div>
                  </div>
                  <div class="flex items-center space-x-2">
                    <select 
                      [(ngModel)]="policy.selectedAgentId" 
                      class="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                      <option value="">Select Agent</option>
                      <option *ngFor="let agent of agents" [value]="agent._id">
                        {{ agent.name }} ({{ agent.email }})
                      </option>
                    </select>
                    <button 
                      (click)="assignPolicy(policy)"
                      [disabled]="!policy.selectedAgentId"
                      class="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm transition-colors">
                      Assign
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Agent Performance Summary -->
            <div>
              <h4 class="font-medium text-gray-800 mb-3">Agent Performance Summary</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div *ngFor="let agent of agents" class="p-4 bg-gray-50 rounded-lg">
                  <div class="font-medium text-gray-800">{{ agent.name }}</div>
                  <div class="text-sm text-gray-600">{{ agent.email }}</div>
                  <div class="mt-2 text-sm">
                    <span class="text-blue-600 font-medium">{{ agent.policiesSold || 0 }}</span> policies assigned
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              (click)="closeAssignmentModal()" 
              class="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium">
              Close
            </button>
            <button 
              (click)="loadUnassignedPolicies()" 
              class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors">
              Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Assign Policy Modal -->
      <div *ngIf="showAssignPolicyModal && selectedPolicyForAssignment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[55]">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-700">Assign Agent to Policy</h3>
          </div>
          
          <div class="px-6 py-4">
            <!-- Policy Details -->
            <div class="mb-4">
              <h4 class="font-medium text-gray-800 mb-2">Policy Details</h4>
              <div class="bg-gray-50 p-3 rounded-lg">
                <p class="font-medium">{{ selectedPolicyForAssignment?.policyProductId?.title || 'Unknown Policy' }}</p>
                <p class="text-sm text-gray-600">{{ selectedPolicyForAssignment?.policyProductId?.code || 'N/A' }}</p>
                <p class="text-sm text-gray-600">Customer: {{ selectedPolicyForAssignment?.userId?.name || 'Unknown' }}</p>
                <p class="text-sm text-gray-600">Premium: {{ formatCurrency(selectedPolicyForAssignment?.premiumPaid || 0) }}</p>
              </div>
            </div>

            <!-- Agent Selection -->
            <div class="mb-4">
              <label for="agentSelect" class="block text-sm font-medium text-gray-700 mb-2">Select Agent</label>
              <select 
                id="agentSelect"
                [(ngModel)]="selectedAgentForAssignment" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="">Choose an agent...</option>
                <option *ngFor="let agent of agents" [value]="agent._id">
                  {{ agent.name }} ({{ agent.email }}) - {{ agent.policiesSold || 0 }} policies
                </option>
              </select>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
            <button 
              (click)="closeAssignPolicyModal()" 
              class="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium">
              Cancel
            </button>
            <button 
              (click)="assignSinglePolicy()" 
              [disabled]="!selectedAgentForAssignment"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors">
              Assign Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminAgentManagementComponent implements OnInit {
  private http = inject(HttpClient);

  agents: Agent[] = [];
  selectedAgent: Agent | null = null;
  showCreateModal = false;
  showAssignmentModal = false;
  showAssignPolicyModal = false;
  unassignedPolicies: any[] = [];
  selectedPolicyForAssignment: any = null;
  selectedAgentForAssignment = '';
  bulkSelectedAgent = '';
  allSelected = false;
  newAgent = {
    name: '',
    email: '',
    password: ''
  };

  get selectedPolicies() {
    return this.unassignedPolicies.filter(policy => policy.selected);
  }

  ngOnInit(): void {
    this.loadAgents();
    this.loadUnassignedPolicies();
  }

  loadAgents(): void {
    this.http.get<Agent[]>(`${environment.apiUrl}/agents`).subscribe({
      next: (agents) => {
        this.agents = agents;
      },
      error: (error) => {
        console.error('Error loading agents:', error);
      }
    });
  }

  viewAgentDetails(agent: Agent): void {
    this.selectedAgent = agent;
  }

  closeAgentDetails(): void {
    this.selectedAgent = null;
  }

  toggleAgentStatus(agent: Agent): void {
    agent.isActive = !agent.isActive;
    // In a real app, you'd make an API call here
    console.log('Agent status toggled:', agent);
    this.closeAgentDetails();
  }

  openCreateAgentModal(): void {
    this.newAgent = { name: '', email: '', password: '' };
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newAgent = { name: '', email: '', password: '' };
  }

  createAgent(): void {
    if (!this.newAgent.name || !this.newAgent.email || !this.newAgent.password) {
      alert('Please fill in all fields');
      return;
    }

    this.http.post(`${environment.apiUrl}/agents`, this.newAgent).subscribe({
      next: (response: any) => {
        alert('Agent created successfully!');
        this.closeCreateModal();
        this.loadAgents(); // Reload agents list
      },
      error: (error) => {
        console.error('Error creating agent:', error);
        alert('Error creating agent: ' + (error.error?.message || error.message));
      }
    });
  }

  openAssignmentModal(): void {
    this.showAssignmentModal = true;
    this.loadUnassignedPolicies();
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false;
    this.unassignedPolicies = [];
  }

  loadUnassignedPolicies(): void {
    this.http.get<any[]>(`${environment.apiUrl}/agents/unassigned-policies`).subscribe({
      next: (policies) => {
        this.unassignedPolicies = policies.map(policy => ({
          ...policy,
          selectedAgentId: '',
          selected: false
        }));
        this.allSelected = false;
      },
      error: (error) => {
        console.error('Error loading unassigned policies:', error);
        alert('Error loading unassigned policies: ' + (error.error?.message || error.message));
      }
    });
  }

  assignPolicy(policy: any): void {
    if (!policy.selectedAgentId) {
      alert('Please select an agent');
      return;
    }

    this.http.post(`${environment.apiUrl}/agents/assign`, {
      policyId: policy._id,
      agentId: policy.selectedAgentId
    }).subscribe({
      next: (response) => {
        alert('Policy assigned successfully!');
        this.loadUnassignedPolicies();
        this.loadAgents(); // Refresh agent list to update counts
      },
      error: (error) => {
        console.error('Error assigning policy:', error);
        alert('Error assigning policy: ' + (error.error?.message || error.message));
      }
    });
  }

  openAssignPolicyModal(policy: any): void {
    this.selectedPolicyForAssignment = policy;
    this.selectedAgentForAssignment = '';
    this.showAssignPolicyModal = true;
  }

  closeAssignPolicyModal(): void {
    this.showAssignPolicyModal = false;
    this.selectedPolicyForAssignment = null;
    this.selectedAgentForAssignment = '';
  }

  assignSinglePolicy(): void {
    if (!this.selectedPolicyForAssignment || !this.selectedAgentForAssignment) {
      alert('Please select an agent');
      return;
    }

    this.http.post(`${environment.apiUrl}/agents/assign`, {
      policyId: this.selectedPolicyForAssignment._id,
      agentId: this.selectedAgentForAssignment
    }).subscribe({
      next: (response) => {
        alert('Agent assigned successfully!');
        this.closeAssignPolicyModal();
        this.loadUnassignedPolicies();
        this.loadAgents(); // Refresh agent data
      },
      error: (error) => {
        console.error('Error assigning agent:', error);
        alert('Error assigning agent: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }

  toggleSelectAll(): void {
    this.allSelected = !this.allSelected;
    this.unassignedPolicies.forEach(policy => {
      policy.selected = this.allSelected;
    });
  }

  updateSelection(): void {
    const selectedCount = this.unassignedPolicies.filter(policy => policy.selected).length;
    this.allSelected = selectedCount === this.unassignedPolicies.length;
  }

  clearSelection(): void {
    this.unassignedPolicies.forEach(policy => {
      policy.selected = false;
    });
    this.allSelected = false;
    this.bulkSelectedAgent = '';
  }

  bulkAssignPolicies(): void {
    if (!this.bulkSelectedAgent) {
      alert('Please select an agent for bulk assignment');
      return;
    }

    const selectedPolicies = this.selectedPolicies;
    if (selectedPolicies.length === 0) {
      alert('Please select at least one policy');
      return;
    }

    if (confirm(`Are you sure you want to assign ${selectedPolicies.length} policies to the selected agent?`)) {
      const assignments = selectedPolicies.map(policy => ({
        policyId: policy._id,
        agentId: this.bulkSelectedAgent
      }));

      // Assign all policies
      const assignmentPromises = assignments.map(assignment => 
        this.http.post(`${environment.apiUrl}/agents/assign`, assignment).toPromise()
      );

      Promise.all(assignmentPromises).then(() => {
        alert(`${selectedPolicies.length} policies assigned successfully!`);
        this.clearSelection();
        this.loadUnassignedPolicies();
        this.loadAgents();
      }).catch(error => {
        console.error('Error in bulk assignment:', error);
        alert('Error assigning policies: ' + (error.error?.message || 'Unknown error'));
      });
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }
}
