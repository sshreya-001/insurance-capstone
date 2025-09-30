export interface Payment {
  _id: string;
  userId: string;
  userPolicyId: string;
  amount: number;
  method: 'CARD' | 'NETBANKING' | 'OFFLINE' | 'SIMULATED';
  reference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MakePaymentRequest {
  userPolicyId: string;
  method: 'CARD' | 'NETBANKING' | 'OFFLINE' | 'SIMULATED';
  reference?: string;
}