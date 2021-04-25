import { FC } from 'react';
import { PlayerProvider } from './usePlayer';

const Providers: FC = ({ children }) => {
  return <PlayerProvider>{children}</PlayerProvider>;
};

export { Providers };
