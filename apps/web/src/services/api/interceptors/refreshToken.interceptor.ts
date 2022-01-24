import { AxiosError, AxiosInstance } from 'axios';

import { browserSignOut } from '../../../contexts/Auth.context';
import { getRefreshToken, saveJwtTokens } from '../../cookies';
import { SessionsResponse } from '../dtos';
import { AuthorizationError } from '../errors/AuthorizationError';
import { setAuthorization } from '../helpers/setAuthorization';

type Queue = {
  onFulfilled: (token: string) => void;
  onRejected: (err: AxiosError) => void;
};

const REFRESH_URL = '/refresh';

export const refreshTokenInterceptor = (
  api: AxiosInstance,
  ctx = undefined
): VoidFunction => {
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

            const refreshToken = getRefreshToken(ctx);

            api
              .post<SessionsResponse>(REFRESH_URL, { refreshToken })
              .then((response) => {
                const data = response.data;

                saveJwtTokens(data, ctx);
                setAuthorization(data.accessToken, api);

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
                browserSignOut();
              })
              .finally(() => {
                isRefreshing = false;
                failedRequestsQueue.splice(0, failedRequestsQueue.length);
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onFulfilled: (token: string) => {
                setAuthorization(token, requestConfig);

                resolve(api(requestConfig));
              },
              onRejected: (err: AxiosError) => reject(err),
            });
          });
        } else {
          if (!process.browser) {
            return Promise.reject(new AuthorizationError());
          }
          browserSignOut();
        }
      }

      return Promise.reject(error);
    }
  );

  return () => api.interceptors.response.eject(interceptorId);
};
