import axios from 'axios';

import { getAccessToken } from '../cookies';
import { setAuthorizationHeader } from './helpers/setAuthorizationHeader';
import { refreshTokenInterceptor } from './interceptors/refreshToken.interceptor';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

setAuthorizationHeader(getAccessToken());

refreshTokenInterceptor(api);

export { api, setAuthorizationHeader };
