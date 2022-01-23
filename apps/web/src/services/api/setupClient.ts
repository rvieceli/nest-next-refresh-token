import axios from 'axios';

import { getAccessToken } from '../cookies';
import { setAuthorization } from './helpers/setAuthorization';
import { refreshTokenInterceptor } from './interceptors/refreshToken.interceptor';

const setupClient = (ctx = undefined) => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  setAuthorization(getAccessToken(ctx), api);

  refreshTokenInterceptor(api, ctx);

  return api;
};

export { setupClient };
