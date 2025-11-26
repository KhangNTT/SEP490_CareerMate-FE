'use client';

import { useEffect } from 'react';
import { useCVStore } from '@/stores/cvStore';

/**
 * StoreInitializer - Component để force initialize Zustand stores
 * Mount component này trong layout để đảm bảo stores luôn được khởi tạo
 */
export function StoreInitializer() {
  const cvStore = useCVStore();

  useEffect(() => {
    console.log('🔧 StoreInitializer mounted');
    console.log('📦 CV Store state:', cvStore);
  }, [cvStore]);

  return null; // Không render gì cả
}
