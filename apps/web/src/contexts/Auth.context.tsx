import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import Router from 'next/router';

import { api, setAuthorizationHeader } from 'app/services/api';
import { User, SessionsResponse } from 'app/services/api/dtos';
import {
  destroyJwtTokens,
  getAccessToken,
  saveJwtTokens,
} from 'app/services/cookies';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user?: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      api
        .get<unknown, { data: User }>('/me')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  const signIn = async (credentials: SignInCredentials) => {
    try {
      const { data } = await api.post<SessionsResponse>(
        '/sessions',
        credentials
      );

      saveJwtTokens(data);

      setAuthorizationHeader(data.accessToken);

      setUser(data.user);

      Router.push('/dashboard');
    } catch (err) {
      alert('Email or password invalid');
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: Boolean(user), signIn, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);

  return auth;
};

export const signOut = () => {
  destroyJwtTokens();
  Router.push('/');
};
