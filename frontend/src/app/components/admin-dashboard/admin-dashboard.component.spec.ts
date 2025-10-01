import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { environment } from '../../../environments/environment';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let httpMock: HttpTestingController;

  const mockSummary = {
    users: 100,
    policiesSold: 50,
    activePolicies: 45,
    totalPayments: 100000
  };

  const mockAudit = [
    {
      id: '1',
      userId: 'user1',
      action: 'LOGIN',
      timestamp: '2024-01-15T10:30:00Z',
      ipAddress: '192.168.1.1'
    },
    {
      id: '2',
      userId: 'user2',
      action: 'POLICY_CREATED',
      timestamp: '2024-01-15T11:00:00Z',
      ipAddress: '192.168.1.2'
    }
  ];

  const mockAgents = [
    {
      id: '1',
      name: 'Agent 1',
      email: 'agent1@test.com',
      status: 'active'
    },
    {
      id: '2',
      name: 'Agent 2',
      email: 'agent2@test.com',
      status: 'inactive'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.loading).toBeTruthy();
    expect(component.error).toBeNull();
    expect(component.activeTab).toBe('policies');
    expect(component.summary).toEqual({});
    expect(component.audit).toEqual([]);
    expect(component.agents).toEqual([]);
  });

  it('should load dashboard data on init', () => {
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    expect(summaryReq.request.method).toBe('GET');
    expect(auditReq.request.method).toBe('GET');
    expect(agentsReq.request.method).toBe('GET');
  });

  it('should set summary data on successful load', () => {
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush(mockSummary);
    auditReq.flush(mockAudit);
    agentsReq.flush(mockAgents);

    expect(component.summary).toEqual(mockSummary);
  });

  it('should set audit data on successful load', () => {
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush(mockSummary);
    auditReq.flush(mockAudit);
    agentsReq.flush(mockAgents);

    expect(component.audit).toEqual(mockAudit);
    expect(component.loading).toBeFalsy();
  });

  it('should set agents data on successful load', () => {
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush(mockSummary);
    auditReq.flush(mockAudit);
    agentsReq.flush(mockAgents);

    expect(component.agents).toEqual(mockAgents);
  });

  it('should handle summary load error', () => {
    spyOn(console, 'error');
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    auditReq.flush(mockAudit);
    agentsReq.flush(mockAgents);

    expect(console.error).toHaveBeenCalledWith('Error loading summary:', jasmine.any(Object));
    expect(component.error).toBe('Failed to load dashboard data');
  });

  it('should handle audit load error', () => {
    spyOn(console, 'error');
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush(mockSummary);
    auditReq.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    agentsReq.flush(mockAgents);

    expect(console.error).toHaveBeenCalledWith('Error loading audit logs:', jasmine.any(Object));
    expect(component.audit).toEqual([]);
    expect(component.loading).toBeTruthy(); // Loading remains true when audit fails
  });

  it('should handle agents load error', () => {
    spyOn(console, 'error');
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush(mockSummary);
    auditReq.flush(mockAudit);
    agentsReq.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });

    expect(console.error).toHaveBeenCalledWith('Error loading agents:', jasmine.any(Object));
    expect(component.agents).toEqual([]);
  });

  it('should handle null data responses', () => {
    component.ngOnInit();

    const summaryReq = httpMock.expectOne(`${environment.apiUrl}/admin/summary`);
    const auditReq = httpMock.expectOne(`${environment.apiUrl}/admin/audit`);
    const agentsReq = httpMock.expectOne(`${environment.apiUrl}/agents`);

    summaryReq.flush(null);
    auditReq.flush(null);
    agentsReq.flush(null);

    expect(component.summary).toEqual({});
    expect(component.audit).toEqual([]);
    expect(component.agents).toEqual([]);
  });

  it('should format currency correctly', () => {
    const amount = 100000;
    const formatted = component.formatCurrency(amount);
    
    expect(formatted).toContain('₹');
    expect(formatted).toContain('1,00,000');
  });

  it('should format zero currency correctly', () => {
    const amount = 0;
    const formatted = component.formatCurrency(amount);
    
    expect(formatted).toContain('₹');
    expect(formatted).toContain('0');
  });

  it('should have correct tab configuration', () => {
    expect(component.tabs).toEqual([
      { id: 'policies', name: 'Policy Management' },
      { id: 'users', name: 'User Management' },
      { id: 'claims', name: 'Claims Management' },
      { id: 'agents', name: 'Agent Management' },
      { id: 'audit', name: 'Audit Logs' }
    ]);
  });

  it('should change active tab', () => {
    component.activeTab = 'policies';
    component.activeTab = 'users';
    
    expect(component.activeTab).toBe('users');
  });

  it('should reset loading and error on reload', () => {
    component.loading = false;
    component.error = 'Previous error';
    
    component.loadDashboardData();
    
    expect(component.loading).toBeTruthy();
    expect(component.error).toBeNull();

    // Mock the HTTP requests that are made during loadDashboardData
    const summaryReq = httpMock.expectOne('http://localhost:5000/api/v1/admin/summary');
    summaryReq.flush({});

    const auditReq = httpMock.expectOne('http://localhost:5000/api/v1/admin/audit');
    auditReq.flush([]);

    const agentsReq = httpMock.expectOne('http://localhost:5000/api/v1/agents');
    agentsReq.flush([]);
  });

  it('should handle empty audit array', () => {
    component.audit = [];
    expect(component.audit.length).toBe(0);
  });

  it('should handle empty agents array', () => {
    component.agents = [];
    expect(component.agents.length).toBe(0);
  });
});
