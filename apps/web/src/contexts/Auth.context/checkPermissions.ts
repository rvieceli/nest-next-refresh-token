import { NonEmptyArray, RequireAtLeastOne } from '@auth/shared-types';

const bringMeAnArray = (value: string | string[]): string[] => {
  if (Array.isArray(value)) {
    return value;
  }
  return [value];
};

export type PermissionsAndRoles = {
  permissions?: string | NonEmptyArray<string>;
  roles?: string | NonEmptyArray<string>;
};

type User = {
  permissions?: string[];
  roles?: string[];
};

type CheckPermissionsProps = {
  user: User;
} & RequireAtLeastOne<PermissionsAndRoles>;

export const checkPermissions = ({
  user,
  permissions,
  roles,
}: CheckPermissionsProps): boolean => {
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
