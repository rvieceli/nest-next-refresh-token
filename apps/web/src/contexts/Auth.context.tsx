import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import Router from 'next/router';

import { api, setAuthorization } from 'app/services/api';
import { User, SessionsResponse } from 'app/services/api/dtos';
import { AuthorizationError } from 'app/services/api/errors/AuthorizationError';
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

export const useAuth = () => {
  const auth = useContext(AuthContext);

  return auth;
};

export const browserSignOut = () => {
  if (!process.browser) {
    return;
  }
  destroyJwtTokens();
  Router.push('/');
};

export function withSSRGuest<T>(fn: GetServerSideProps<T>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const accessToken = getAccessToken(ctx);

    if (accessToken) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      };
    }

    return fn(ctx);
  };
}

export function withSSRAuth<T>(fn: GetServerSideProps<T>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const accessToken = getAccessToken(ctx);

    if (!accessToken) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthorizationError) {
        destroyJwtTokens(ctx);
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
