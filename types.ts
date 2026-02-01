
export type Category = 
  | 'Food & Dining'
  | 'Groceries'
  | 'Travel & Transportation'
  | 'Entertainment'
  | 'Utilities & Bills'
  | 'Shopping'
  | 'Health & Medical'
  | 'Education'
  | 'Miscellaneous';

export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: Category;
  paymentMode: PaymentMode;
  date: string;
  notes?: string;
  createdAt: number;
}

export interface ExpenseFormData {
  description: string;
  amount: string;
  category: Category;
  paymentMode: PaymentMode;
  date: string;
  notes: string;
}
