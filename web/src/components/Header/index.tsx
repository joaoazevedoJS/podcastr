import { FC, useMemo } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import styles from './styles.module.scss';

const Header: FC = () => {
  const currentDate = useMemo(() => {
    return format(new Date(), 'EEE, d MMMM', {
      locale: ptBR,
    });
  }, []);

  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <img src="/logo.svg" alt="Podcastr" />
      </Link>

      <p>O melhor para você ouvir, sempre!</p>

      <span>{currentDate}</span>
    </header>
  );
};

export { Header };
