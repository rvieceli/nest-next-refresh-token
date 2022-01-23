import { FormEvent, useState } from 'react';

import type { GetServerSideProps, NextPage } from 'next';

import { useAuth, withSSRGuest } from 'app/contexts/Auth.context';

import styles from './index.module.css';

const Home: NextPage = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('nathan.drake@naughtydog.com');
  const [password, setPassword] = useState('123456');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await signIn({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">Enter</button>
    </form>
  );
};

export const getServerSideProps: GetServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});

export default Home;
