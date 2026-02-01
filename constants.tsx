
import React from 'react';
import { 
  Utensils, 
  ShoppingCart, 
  Car, 
  Clapperboard, 
  Zap, 
  ShoppingBag, 
  HeartPulse, 
  GraduationCap, 
  MoreHorizontal,
  Wallet,
  Smartphone,
  CreditCard,
  Building2
} from 'lucide-react';
import { Category, PaymentMode } from './types';

export const CATEGORIES: Category[] = [
  'Food & Dining',
  'Groceries',
  'Travel & Transportation',
  'Entertainment',
  'Utilities & Bills',
  'Shopping',
  'Health & Medical',
  'Education',
  'Miscellaneous'
];

export const PAYMENT_MODES: PaymentMode[] = ['Cash', 'UPI', 'Card', 'Bank Transfer'];

export const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'Food & Dining': <Utensils className="w-4 h-4" />,
  'Groceries': <ShoppingCart className="w-4 h-4" />,
  'Travel & Transportation': <Car className="w-4 h-4" />,
  'Entertainment': <Clapperboard className="w-4 h-4" />,
  'Utilities & Bills': <Zap className="w-4 h-4" />,
  'Shopping': <ShoppingBag className="w-4 h-4" />,
  'Health & Medical': <HeartPulse className="w-4 h-4" />,
  'Education': <GraduationCap className="w-4 h-4" />,
  'Miscellaneous': <MoreHorizontal className="w-4 h-4" />
};

export const PAYMENT_ICONS: Record<PaymentMode, React.ReactNode> = {
  'Cash': <Wallet className="w-4 h-4" />,
  'UPI': <Smartphone className="w-4 h-4" />,
  'Card': <CreditCard className="w-4 h-4" />,
  'Bank Transfer': <Building2 className="w-4 h-4" />
};

export const CHART_COLORS = [
  '#10b981', // Emerald 500
  '#3b82f6', // Blue 500
  '#f59e0b', // Amber 500
  '#ef4444', // Red 500
  '#8b5cf6', // Violet 500
  '#ec4899', // Pink 500
  '#06b6d4', // Cyan 500
  '#f97316', // Orange 500
  '#64748b', // Slate 500
];
