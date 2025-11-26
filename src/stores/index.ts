// Export all stores and initialize them
export { useCVStore, type CV, type CVType } from './cvStore';

// Initialize stores on import
if (typeof window !== 'undefined') {
  // This will trigger the store initialization
  import('./cvStore').then(() => {
    console.log('🚀 All stores initialized');
  });
}
