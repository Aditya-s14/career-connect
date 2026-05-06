export type UserRole = 'candidate' | 'employer';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  skills?: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}
