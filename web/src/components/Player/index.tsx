/* eslint-disable jsx-a11y/media-has-caption */
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { usePlayer } from '../../hooks/usePlayer';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

const Player: FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [progress, setProgress] = useState(0);

  const {
    isPlaying,
    isLooping,
    isShuffling,
    episodeList,
    hasNext,
    hasPrevius,
    getCurrentEpisode,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    clearPlayerState,
  } = usePlayer();

  const episode = useMemo(() => getCurrentEpisode(), [getCurrentEpisode]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const setupProgressListener = useCallback(() => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }, []);

  const handleMoveProgressBars = useCallback((amout: number) => {
    audioRef.current.currentTime = amout;
    setProgress(amout);
  }, []);

  const handleEpisodeEnded = useCallback(() => {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }, [clearPlayerState, hasNext, playNext]);

  return (
    <>
      {episode && (
        <audio
          src={episode.file.url}
          ref={audioRef}
          autoPlay
          loop={isLooping}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleEpisodeEnded}
        />
      )}

      <div className={styles.playerContainer}>
        <header>
          <img src="/playing.svg" alt="Tocando agora" />

          <strong>Tocando agora</strong>
        </header>

        {episode ? (
          <div className={styles.currentPlayer}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              alt={episode.title}
              objectFit="cover"
            />

            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )}

        <footer className={!episode ? styles.empty : ''}>
          <div className={styles.progress}>
            <span>{convertDurationToTimeString(progress)}</span>

            <div className={styles.slider}>
              {episode ? (
                <Slider
                  max={episode.file.duration}
                  value={progress}
                  onChange={handleMoveProgressBars}
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{
                    backgroundColor: '#04d361',
                    borderColor: '#04d361',
                  }}
                />
              ) : (
                <div className={styles.emptySlider} />
              )}
            </div>

            <span>
              {convertDurationToTimeString(episode?.file.duration ?? 0)}
            </span>
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              disabled={!episode || episodeList.length === 1}
              onClick={toggleShuffle}
              className={isShuffling ? styles.isActive : ''}
            >
              <img src="/shuffle.svg" alt="Embaralhar" />
            </button>

            <button
              type="button"
              disabled={!episode || !hasPrevius}
              onClick={playPrevious}
            >
              <img src="/play-previous.svg" alt="Tocar Anterior" />
            </button>

            <button
              type="button"
              className={styles.playButton}
              disabled={!episode}
              onClick={togglePlay}
            >
              {isPlaying ? (
                <img src="/pause.svg" alt="Tocar" />
              ) : (
                <img src="/play.svg" alt="Tocar" />
              )}
            </button>

            <button
              type="button"
              disabled={!episode || !hasNext}
              onClick={playNext}
            >
              <img src="/play-next.svg" alt="Tocar próxima" />
            </button>

            <button
              type="button"
              disabled={!episode}
              onClick={toggleLoop}
              className={isLooping ? styles.isActive : ''}
            >
              <img src="/repeat.svg" alt="Repeter" />
            </button>
          </div>
        </footer>
      </div>
    </>
  );
};

export { Player };
