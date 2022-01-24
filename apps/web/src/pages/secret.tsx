import { NextPage } from 'next';

import { withSSRAuth } from '../contexts/Auth.context';

const Secret: NextPage = () => {
  return (
    <div>
      <h1>This page is secret</h1>
    </div>
  );
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  { roles: 'administrator' }
);

export default Secret;
