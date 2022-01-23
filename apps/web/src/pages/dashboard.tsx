import { useEffect, useState } from 'react';

import type { GetServerSideProps, NextPage } from 'next';

import { useAuth, withSSRAuth } from 'app/contexts/Auth.context';
import { api } from 'app/services/api';
import { setupClient } from 'app/services/api/setupClient';

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

export const getServerSideProps: GetServerSideProps = withSSRAuth(
  async (ctx) => {
    const api = setupClient(ctx);

    const { data: me } = await api.get('/me');

    return {
      props: {
        me,
      },
    };
  }
);

export default Dashboard;
