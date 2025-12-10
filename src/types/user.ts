export interface Role {
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  status: string;
  roles: Role[];
}

export interface UserResponse {
  content: User[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  code: number;
  result: T;
}

// Extended user profile type
export interface UserProfile extends User {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  biography?: string;
  skills?: string[];
  jobTitle?: string;
  company?: string;
  createdAt?: string;
  updatedAt?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}