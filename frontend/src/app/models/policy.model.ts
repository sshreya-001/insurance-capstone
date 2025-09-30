export interface PolicyProduct {
  _id: string;
  code: string;
  title: string;
  description: string;
  premium: number;
  termMonths: number;
  minSumInsured: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPolicy {
  _id: string;
  userId: string;
  policyProductId: PolicyProduct;
  startDate: Date;
  endDate: Date;
  premiumPaid: number;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  assignedAgentId?: User;
  nominee: {
    name: string;
    relation: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PurchasePolicyRequest {
  termMonths?: number;
  nominee: {
    name: string;
    relation: string;
  };
}