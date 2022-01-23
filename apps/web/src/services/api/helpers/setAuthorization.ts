import { AxiosInstance, AxiosRequestConfig } from 'axios';

import { api } from '..';

function setAuthorization(
  token: string,
  instance: AxiosInstance | AxiosRequestConfig = api
): void {
  const authorization = `Bearer ${token}`;

  if ('defaults' in instance) {
    instance.defaults.headers['Authorization'] = authorization;
    return;
  }

  instance.headers['Authorization'] = authorization;
}

export { setAuthorization };
