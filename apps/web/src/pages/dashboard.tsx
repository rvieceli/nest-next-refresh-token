import { useEffect, useState } from 'react';

import type { NextPage } from 'next';

import { useAuth } from 'app/contexts/Auth.context';
import { api } from 'app/services/api';

const Dashboard: NextPage = () => {
  const { user } = useAuth();
  const [apiUser, setApiUser] = useState();

  useEffect(() => {
    api
      .get('/me')
      .then((response) => setApiUser(response.data))
      .catch(() => console.log('Wow no'));
  }, []);

  return (
    <div>
      <h1>Hi, {user?.email}</h1>
      <code>{JSON.stringify(apiUser)}</code>
    </div>
  );
};

export default Dashboard;
