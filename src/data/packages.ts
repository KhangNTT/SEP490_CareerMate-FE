import { Package } from '@/types/billing';

// Mock data for packages
export const PACKAGES: Package[] = [
  {
    package_id: 'basic',
    name: 'Basic Plan',
    price: 0,
    currency: 'VND',
    duration: 'monthly',
    description: 'Suitable for small businesses or startups just starting recruitment',
    privileges: [
      'Post up to 5 job listings per month',
      'View up to 50 candidate profiles per month',
      'Basic candidate search',
      'Email support during business hours',
      'Basic job posting analytics'
    ]
  },
  {
    package_id: 'pro',
    name: 'Professional Plan',
    price: 1000000,
    currency: 'VND',
    duration: 'monthly',
    description: 'Ideal for small and medium-sized businesses with frequent hiring needs',
    popular: true,
    privileges: [
      'Post up to 20 job listings per month',
      'Unlimited candidate profile views',
      'Advanced candidate search with filters',
      'Highlighted company logo',
      'Priority job listing display',
      '24/7 chat and email support',
      'Detailed recruitment performance reports',
      'Save and manage favorite candidates'
    ]
  },
  {
    package_id: 'premium',
    name: 'Premium Plan',
    price: 1500000,
    currency: 'VND',
    duration: 'monthly',
    description: 'Designed for corporations and large enterprises with high-volume hiring needs',
    privileges: [
      'Unlimited job postings',
      'Full access to detailed candidate profiles',
      'AI-powered smart search tools',
      'Custom company branding',
      'Continuous top placement for job listings',
      'Dedicated Account Manager support',
      'Built-in video call interviews',
      'API integration with HR systems',
      'Advanced recruitment analytics',
      'Free platform training sessions'
    ]
  }
];

// Currency formatting utility
export const formatCurrency = (amount: number, currency: 'VND' | 'USD'): string => {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};
