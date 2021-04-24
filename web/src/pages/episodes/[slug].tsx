import { FC, useMemo } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import api from '../../services/api';

import styles from '../../styles/pages/episodes/episode.module.scss';

import { IEpisode, IEpisodeFormated } from '../../models/IEpisode';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

interface EpisodeProps {
  episode: IEpisodeFormated;
}

const Episode: FC<EpisodeProps> = ({ episode }) => {
  const router = useRouter();

  const description = useMemo(() => {
    return episode.description.split(/<p>|<\/p>/);
  }, [episode.description]);

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />

        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>

        <span>{episode.members}</span>
        <span>{episode.publishedAtFormated}</span>
        <span>{episode.durationFormated}</span>
      </header>

      <div className={styles.description}>
        {description.map(content => (
          <p key={content}>{content}</p>
        ))}
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<EpisodeProps> = async ({
  params,
}) => {
  const { data: episode } = await api.get<IEpisode>(`/episodes/${params.slug}`);

  const episodeFormated: IEpisodeFormated = {
    ...episode,
    publishedAtFormated: format(parseISO(episode.published_at), 'd MMM yy', {
      locale: ptBR,
    }),
    durationFormated: convertDurationToTimeString(
      Number(episode.file.duration),
    ),
  };

  return {
    props: {
      episode: episodeFormated,
    },
    revalidate: 60 * 60 * 24, // 24h
  };
};

export default Episode;
