import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { JwtTokenPayload } from '@auth/shared-types';
import decode from 'jwt-decode';

import { AuthorizationError } from '../../services/api/errors/AuthorizationError';
import { destroyJwtTokens, getAccessToken } from '../../services/cookies';
import { PermissionsAndRoles, checkPermissions } from './checkPermissions';

type WithSSRAuthOptions = PermissionsAndRoles;

export function withSSRAuth<T>(
  fn: GetServerSideProps<T>,
  options?: WithSSRAuthOptions
) {
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

    if (options?.permissions || options?.roles) {
      const user = decode<JwtTokenPayload>(accessToken);

      if (
        !checkPermissions({
          user,
          permissions: options.permissions,
          roles: options.roles,
        })
      ) {
        return {
          notFound: true,
        };
      }
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
