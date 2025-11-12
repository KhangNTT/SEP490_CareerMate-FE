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