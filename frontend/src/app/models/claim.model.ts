import { User } from './user.model';
import { UserPolicy } from './policy.model';

export interface Claim {
  _id: string;
  userId: User;
  userPolicyId: UserPolicy;
  incidentDate: Date;
  description: string;
  amountClaimed: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decisionNotes?: string;
  decidedByAgentId?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubmitClaimRequest {
  userPolicyId: string;
  incidentDate: Date;
  description: string;
  amountClaimed: number;
}

export interface ReviewClaimRequest {
  status: 'APPROVED' | 'REJECTED';
  notes: string;
}