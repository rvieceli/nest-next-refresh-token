import { Fragment, ReactNode } from 'react';

import { RequireAtLeastOne } from '@auth/shared-types';

import { PermissionsAndRoles } from '../../contexts/Auth.context';
import { useCan } from '../../hooks/useCan';

type CanProps = {
  children: ReactNode;
  not?: boolean;
} & RequireAtLeastOne<PermissionsAndRoles>;

export const Can = ({
  children,
  permissions,
  roles,
  not = false,
}: CanProps) => {
  const canSee = useCan({ permissions, roles });

  if (canSee === not) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
