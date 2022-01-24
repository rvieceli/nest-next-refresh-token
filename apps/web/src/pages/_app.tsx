import { AppProps } from 'next/app';

import { AuthProvider } from '../contexts/Auth.context';

import './styles.css';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default CustomApp;
