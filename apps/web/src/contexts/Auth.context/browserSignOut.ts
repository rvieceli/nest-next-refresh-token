import Router from 'next/router';

import { destroyJwtTokens } from '../../services/cookies';
import { authChannel } from './Channel';

export const browserSignOut = () => {
  if (!process.browser) {
    return;
  }
  destroyJwtTokens();

  authChannel.postMessage('SIGN_OUT');

  Router.push('/');
};
