import { NonEmptyArray, RequireAtLeastOne } from '@auth/shared-types';

import { useAuth } from '../contexts/Auth.context';

export type UseCanParams = RequireAtLeastOne<{
  permissions?: string | NonEmptyArray<string>;
  roles?: string | NonEmptyArray<string>;
}>;

const bringMeAnArray = (value: string | string[]): string[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

export const useCan = ({ permissions, roles }: UseCanParams) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  if (permissions) {
    const hasAllPermissions = bringMeAnArray(permissions).every((permission) =>
      user.permissions?.includes(permission)
    );

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles) {
    const hasAtLeastOneRole = bringMeAnArray(roles).some((role) =>
      user.roles?.includes(role)
    );

    if (!hasAtLeastOneRole) {
      return false;
    }
  }

  return true;
};
