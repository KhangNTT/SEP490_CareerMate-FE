// Subscription Package details
export interface Package {
  package_id: string;         // Unique ID of the package
  name: string;               // Package name
  price: number;              // Price of the package
  currency: 'VND' | 'USD';    // Supported currency
  duration: 'monthly' | 'yearly'; // Billing cycle
  privileges: string[];       // List of included privileges/features
  popular?: boolean;          // Flag to mark the package as "Most Popular"
  description: string;        // Short description of the package
}

// User's subscription details
export interface UserSubscription {
  subscription_id: string;    // Unique subscription ID
  package_id: string;         // The subscribed package ID
  start_date: string;         // Subscription start date
  end_date: string;           // Subscription end date
  status: 'active' | 'expired' | 'cancelled'; // Current subscription status
  auto_renew: boolean;        // Whether auto-renew is enabled
}

// Billing history details (payment records)
export interface BillingHistory {
  transaction_id: string;     // Unique transaction ID
  package_id: string;         // Package related to this transaction
  amount: number;             // Paid amount
  currency: 'VND' | 'USD';    // Payment currency
  payment_date: string;       // Date of payment
  status: 'completed' | 'pending' | 'failed'; // Transaction status
  payment_method: string;     // Payment method (e.g., Credit Card, PayPal, Bank Transfer)
}
