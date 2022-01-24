import Router from 'next/router';

import { destroyJwtTokens } from '../../services/cookies';

export const browserSignOut = () => {
  if (!process.browser) {
    return;
  }
  destroyJwtTokens();
  Router.push('/');
};
