import { ReactNode, useEffect, useState } from 'react';

import Router from 'next/router';

import { api, setAuthorization } from 'app/services/api';
import { SessionsResponse, User } from 'app/services/api/dtos';
import { getAccessToken, saveJwtTokens } from 'app/services/cookies';

import { browserSignOut } from './browserSignOut';
import { AuthContext, SignInCredentials } from './Context';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const accessToken = getAccessToken();

    if (accessToken) {
      api
        .get<User>('/me')
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          browserSignOut();
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

      setAuthorization(data.accessToken);

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
