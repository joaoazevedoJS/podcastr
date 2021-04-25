import { FC } from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';

import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import { Providers } from '../hooks';

import styles from '../styles/app.module.scss';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Providers>
      <div className={styles.appWrapper}>
        <main>
          <Header />

          <Component {...pageProps} />
        </main>

        <Player />
      </div>
    </Providers>
  );
};

export default MyApp;
