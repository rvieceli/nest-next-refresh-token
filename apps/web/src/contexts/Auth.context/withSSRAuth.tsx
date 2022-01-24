import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { AuthorizationError } from 'app/services/api/errors/AuthorizationError';
import { destroyJwtTokens, getAccessToken } from 'app/services/cookies';

export function withSSRAuth<T>(fn: GetServerSideProps<T>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<T>> => {
    const accessToken = getAccessToken(ctx);

    if (!accessToken) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthorizationError) {
        destroyJwtTokens(ctx);
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
}
