import { parseCookies, setCookie, destroyCookie } from 'nookies';

const TOKEN_COOKIE_NAME = 'auth.token';
const REFRESH_TOKEN_COOKIE_NAME = 'auth.refresh_token';
const COOKIE_CONFIG = {
  maxAge: 60 * 60 * 24 * 30, // a month
  path: '/',
};

interface SaveJwtTokensProps {
  accessToken: string;
  refreshToken: string;
}

export const saveJwtTokens = (
  { accessToken, refreshToken }: SaveJwtTokensProps,
  ctx = undefined
) => {
  setCookie(ctx, TOKEN_COOKIE_NAME, accessToken, COOKIE_CONFIG);
  setCookie(ctx, REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_CONFIG);
};

export const getAccessToken = (ctx = undefined) => {
  const cookies = parseCookies(ctx);
  return cookies[TOKEN_COOKIE_NAME];
};

export const getRefreshToken = (ctx = undefined) => {
  const cookies = parseCookies(ctx);
  return cookies[REFRESH_TOKEN_COOKIE_NAME];
};

export const destroyJwtTokens = (ctx = undefined) => {
  destroyCookie(ctx, TOKEN_COOKIE_NAME);
  destroyCookie(ctx, REFRESH_TOKEN_COOKIE_NAME);
};
