import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/user-api';
import { useAuthStore } from '@/store/use-auth-store';

export const useUserProfile = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchUsername = async () => {
      if (!isAuthenticated || !user?.email) {
        setUsername(null);
        console.log('❌ [useUserProfile] No auth or email');
        return;
      }

      // Nếu JWT đã có username, dùng luôn
      if (user?.username) {
        console.log('✅ [useUserProfile] Username from JWT:', user.username);
        setUsername(user.username);
        return;
      }

      // Nếu không, fetch từ API using getCurrentUser (uses /api/users/current)
      console.log('🔄 [useUserProfile] Fetching username from API for:', user.email);
      setLoading(true);
      try {
        const userData = await getCurrentUser();
        console.log('📦 [useUserProfile] API Response:', userData);
        if (userData?.username) {
          console.log('✅ [useUserProfile] Username from API:', userData.username);
          setUsername(userData.username);
        } else {
          console.log('❌ [useUserProfile] No username in API response');
        }
      } catch (error) {
        console.error('❌ [useUserProfile] Error fetching username:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [user, isAuthenticated]);

  return { username, loading };
};
