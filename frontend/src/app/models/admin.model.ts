export interface AuditLog {
  _id: string;
  action: string;
  actorId?: string;
  details: any;
  ip?: string;
  timestamp: Date;
}

export interface AdminSummary {
  users: number;
  policiesSold: number;
  claimsPending: number;
  totalPayments: number;
}