import { useContext } from 'react';

import { AuthContext } from './Context';

export const useAuth = () => {
  const auth = useContext(AuthContext);

  return auth;
};
