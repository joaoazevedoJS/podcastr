import {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { IEpisode } from '../models/IEpisode';

export interface IPlayerContext {
  episodeList: Array<IEpisode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasPrevius: boolean;
  hasNext: boolean;
  play(episode: IEpisode): void;
  getCurrentEpisode(): IEpisode | null;
  togglePlay(): void;
  toggleLoop(): void;
  toggleShuffle(): void;
  setPlayingState(state: boolean): void;
  playList(list: IEpisode[], index: number): void;
  playNext(): void;
  playPrevious(): void;
  clearPlayerState(): void;
}

const PlayerContext = createContext<IPlayerContext>({} as IPlayerContext);

const PlayerProvider: FC = ({ children }) => {
  const [episodeList, setEpisodeList] = useState<IEpisode[]>([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

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

  const toggleLoop = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(!isShuffling);
  }, [isShuffling]);

  const setPlayingState = useCallback((state: boolean) => {
    setIsPlaying(state);
  }, []);

  const playList = useCallback((list: IEpisode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }, []);

  const hasPrevius = useMemo(() => currentEpisodeIndex > 0, [
    currentEpisodeIndex,
  ]);

  const hasNext = useMemo(() => {
    const nextEpisodeIndex = currentEpisodeIndex + 1;

    return isShuffling || nextEpisodeIndex < episodeList.length;
  }, [currentEpisodeIndex, episodeList, isShuffling]);

  const playNext = useCallback(() => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length,
      );

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }, [currentEpisodeIndex, episodeList, hasNext, isShuffling]);

  const playPrevious = useCallback(() => {
    if (hasPrevius) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }, [currentEpisodeIndex, hasPrevius]);

  const clearPlayerState = useCallback(() => {
    setEpisodeList([]);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        hasPrevius,
        hasNext,
        play,
        getCurrentEpisode,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        clearPlayerState,
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
