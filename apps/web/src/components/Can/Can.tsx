import { Fragment, ReactNode } from 'react';

import { useCan, UseCanParams } from '../../hooks/useCan';

interface CanProps {
  children: ReactNode;
  not?: boolean;
}

export const Can = ({
  children,
  permissions,
  roles,
  not = false,
}: CanProps & UseCanParams) => {
  const canSee = useCan({ permissions, roles });

  if (canSee === not) {
    return null;
  }

  return <Fragment>{children}</Fragment>;
};
