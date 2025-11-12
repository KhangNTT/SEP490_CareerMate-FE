"use client";

import { useState, useEffect } from 'react';
import { getRecruiterProfile, type RecruiterProfileData } from '@/lib/recruiter-api';
import toast from 'react-hot-toast';

export function useRecruiterProfile() {
  const [profile, setProfile] = useState<RecruiterProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRecruiterProfile();
      setProfile(response.result);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch recruiter profile';
      setError(errorMessage);
      console.error('Error fetching recruiter profile:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
  };
}
