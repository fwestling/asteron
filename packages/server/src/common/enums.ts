export const Periods = [
  'daily',
  'weekly',
  'monthly',
  'quarterly',
  'yearly',
] as const;

export type Period = (typeof Periods)[number];

export const TransactionTypes = ['basic', 'fee', 'internal transfer'] as const;

export type TransactionType = (typeof TransactionTypes)[number];

export const InvestmentTypes = ['shares', 'cryptocurrency'] as const;

export type InvestmentType = (typeof InvestmentTypes)[number];
