export interface Payment {
  _id: string;
  userId: string;
  userPolicyId: string | {
    _id: string;
    policyProductId: {
      _id: string;
      title: string;
      code: string;
    };
  };
  amount: number;
  method: 'credit_card' | 'debit_card' | 'net_banking' | 'upi' | 'wallet' | 'bank_transfer';
  reference?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MakePaymentRequest {
  userPolicyId: string;
  method: 'credit_card' | 'debit_card' | 'net_banking' | 'upi' | 'wallet' | 'bank_transfer';
  reference: string;
}