import { AxiosError, AxiosInstance } from 'axios';

import { signOut } from 'app/contexts/Auth.context';

import { getRefreshToken, saveJwtTokens } from '../../cookies';
import { SessionsResponse } from '../dtos';
import { setAuthorizationHeader } from '../helpers/setAuthorizationHeader';

type Queue = {
  onFulfilled: (token: string) => void;
  onRejected: (err: AxiosError) => void;
};

const REFRESH_URL = '/refresh';

export const refreshTokenInterceptor = (api: AxiosInstance): VoidFunction => {
  let isRefreshing = false;

  const failedRequestsQueue: Queue[] = [];

  const interceptorId = api.interceptors.response.use(
    undefined,
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.message === 'TOKEN_EXPIRED') {
          const requestConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;

            const refreshToken = getRefreshToken();

            api
              .post<SessionsResponse>(REFRESH_URL, { refreshToken })
              .then((response) => {
                const data = response.data;

                saveJwtTokens(data);
                setAuthorizationHeader(data.accessToken);

                return data.accessToken;
              })
              .then((token) => {
                failedRequestsQueue.forEach((request) =>
                  request.onFulfilled(token)
                );
              })
              .catch((err) => {
                failedRequestsQueue.forEach((request) =>
                  request.onRejected(err)
                );
              })
              .finally(() => {
                isRefreshing = false;
                failedRequestsQueue.splice(0, failedRequestsQueue.length);
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onFulfilled: (token: string) => {
                setAuthorizationHeader(token, requestConfig.headers);

                resolve(api(requestConfig));
              },
              onRejected: (err: AxiosError) => reject(err),
            });
          });
        } else {
          signOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return () => api.interceptors.response.eject(interceptorId);
};
