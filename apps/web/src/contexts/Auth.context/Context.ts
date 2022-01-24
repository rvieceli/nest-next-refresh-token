import { createContext } from 'react';

import { User } from 'app/services/api/dtos';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user?: User;
}

export const AuthContext = createContext({} as AuthContextData);
