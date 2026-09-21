export interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}
