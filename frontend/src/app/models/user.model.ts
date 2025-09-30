export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'agent' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'agent' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}