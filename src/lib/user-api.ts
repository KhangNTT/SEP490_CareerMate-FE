import api from './api';
import { ApiResponse, UserResponse, User } from '@/types/user';

// Lấy thông tin user hiện tại từ token
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/api/users/current');
    console.log('📋 Current user response:', response.data);
    return response.data.result;
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch current user');
  }
};

export const getUserList = async (page: number = 0, size: number = 10): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await api.get(`/api/users/all`, {
      params: {
        page,
        size
      }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

// Lấy thông tin user hiện tại theo email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const response = await api.get(`/api/users/all`, {
      params: {
        page: 0,
        size: 100
      }
    });
    const users = response.data.result.content;
    return users.find((u: User) => u.email === email) || null;
  } catch (error: any) {
    console.error('Error fetching user by email:', error);
    return null;
  }
};