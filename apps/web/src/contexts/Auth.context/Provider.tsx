import { ReactNode, useEffect, useState } from 'react';

import Router from 'next/router';

import { api, setAuthorization } from '../../services/api';
import { SessionsResponse, User } from '../../services/api/dtos';
import { getAccessToken, saveJwtTokens } from '../../services/cookies';
import { browserSignOut } from './browserSignOut';
import { authChannel } from './Channel';
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

  useEffect(() => {
    authChannel.onmessage = () => document.location.reload();
    // authChannel.onmessage = (message) => {
    //   switch (message.data) {
    //     case 'SIGN_OUT':
    //       Router.push('/');
    //       break;
    //     case 'SIGN_IN':
    //       document.location.reload();
    //       break;
    //   }
    // };
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

      authChannel.postMessage('SIGN_IN');

      Router.push('/dashboard');
    } catch (err) {
      alert('Email or password invalid');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        signIn,
        user,
        signOut: browserSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
