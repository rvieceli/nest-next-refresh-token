import type { GetServerSideProps, NextPage } from 'next';

import { Can } from '../components';
import { useAuth, withSSRAuth } from '../contexts/Auth.context';
import { useCan } from '../hooks/useCan';
import { setupClient } from '../services/api/setupClient';

const Dashboard: NextPage = () => {
  const { user } = useAuth();
  const canSeeMetrics = useCan({ permissions: ['metrics.list'] });

  return (
    <div>
      <h1>Hi, {user?.email}</h1>

      <Can roles={'administrator'}>
        <p>I am an administrator</p>
      </Can>

      {canSeeMetrics && <p>I can see the metrics</p>}

      <Can not roles={['editor']} permissions={'post.edit'}>
        <p>I am not an editor and I cannot edit a post</p>
      </Can>
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
