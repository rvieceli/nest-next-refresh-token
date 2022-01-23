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

export const saveJwtTokens = ({
  accessToken,
  refreshToken,
}: SaveJwtTokensProps) => {
  setCookie(undefined, TOKEN_COOKIE_NAME, accessToken, COOKIE_CONFIG);
  setCookie(undefined, REFRESH_TOKEN_COOKIE_NAME, refreshToken, COOKIE_CONFIG);
};

export const getAccessToken = () => {
  const cookies = parseCookies();
  return cookies[TOKEN_COOKIE_NAME];
};

export const getRefreshToken = () => {
  const cookies = parseCookies();
  return cookies[REFRESH_TOKEN_COOKIE_NAME];
};

export const destroyJwtTokens = () => {
  destroyCookie(undefined, TOKEN_COOKIE_NAME);
  destroyCookie(undefined, REFRESH_TOKEN_COOKIE_NAME);
};
