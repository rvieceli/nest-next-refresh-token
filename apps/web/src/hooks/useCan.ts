import { RequireAtLeastOne } from '@auth/shared-types';

import {
  checkPermissions,
  PermissionsAndRoles,
  useAuth,
} from '../contexts/Auth.context';

export const useCan = ({
  permissions,
  roles,
}: RequireAtLeastOne<PermissionsAndRoles>) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return false;
  }

  return checkPermissions({ user, permissions, roles });
};
