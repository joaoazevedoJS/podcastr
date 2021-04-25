import { createContext, FC, useCallback, useContext, useState } from 'react';

import { IEpisode } from '../models/IEpisode';

export interface IPlayerContext {
  episodeList: Array<IEpisode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play(episode: IEpisode): void;
  getCurrentEpisode(): IEpisode | null;
  togglePlay(): void;
  setPlayingState(state: boolean): void;
}

const PlayerContext = createContext<IPlayerContext>({} as IPlayerContext);

const PlayerProvider: FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<IEpisode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((episode: IEpisode) => {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }, []);

  const getCurrentEpisode = useCallback(() => {
    return episodeList[currentEpisodeIndex] ?? null;
  }, [currentEpisodeIndex, episodeList]);

  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        play,
        getCurrentEpisode,
        togglePlay,
        setPlayingState,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

function usePlayer(): IPlayerContext {
  const context = useContext(PlayerContext);

  return context;
}

export { PlayerProvider, usePlayer };
