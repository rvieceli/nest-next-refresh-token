import { AxiosRequestHeaders, HeadersDefaults } from 'axios';

import { api } from '..';

const setAuthorizationHeader = (
  token: string,
  headers: HeadersDefaults | AxiosRequestHeaders = api.defaults.headers
) => {
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
};

export { setAuthorizationHeader };
