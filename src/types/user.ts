export interface Role {
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
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
// Additional user-related types can be added here
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatar?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  biography?: string;
  skills?: string[];
  jobTitle?: string;
  company?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
}