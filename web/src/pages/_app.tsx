import { FC } from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';

import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div className={styles.appWrapper}>
      <main>
        <Header />

        <Component {...pageProps} />
      </main>

      <Player />
    </div>
  );
};

export default MyApp;
