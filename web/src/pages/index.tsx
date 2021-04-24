import { FC } from 'react';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';

import api from '../services/api';

import styles from '../styles/pages/home.module.scss';

import { IEpisode, IEpisodeFormated } from '../models/IEpisode';

interface HomeProps {
  allEpisodes: Array<IEpisodeFormated>;
  latestEpisodes: Array<IEpisodeFormated>;
}

const Home: FC<HomeProps> = ({ allEpisodes, latestEpisodes }) => {
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Último lançamentos</h2>

        <ul>
          {latestEpisodes.map(episode => (
            <li key={episode.id}>
              <Image
                width={192}
                height={192}
                src={episode.thumbnail}
                alt={episode.title}
                objectFit="cover"
              />

              <div className={styles.episodeDetails}>
                <Link href={`/episodes/${episode.id}`}>{episode.title}</Link>

                <p>{episode.members}</p>

                <span>{episode.publishedAtFormated}</span>
                <span>{episode.durationFormated}</span>
              </div>

              <button type="button">
                <img src="/play-green.svg" alt="Tocar Episódio" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th>{}</th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th>{}</th>
            </tr>
          </thead>

          <tbody>
            {allEpisodes.map(episode => (
              <tr key={episode.id}>
                <td style={{ width: 72 }}>
                  <Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                </td>

                <td>
                  <Link href={`episodes/${episode.id}`}>{episode.title}</Link>
                </td>

                <td>{episode.members}</td>
                <td style={{ width: 100 }}>{episode.publishedAtFormated}</td>
                <td>{episode.durationFormated}</td>

                <td>
                  <button type="button">
                    <img src="/play-green.svg" alt="Tocar Episódio" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const { data } = await api.get<IEpisode[]>('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc',
    },
  });

  const episodes = data.map(episode => {
    const episodeFormated: IEpisodeFormated = {
      ...episode,
      publishedAtFormated: format(parseISO(episode.published_at), 'd MMM yy', {
        locale: ptBR,
      }),
      durationFormated: convertDurationToTimeString(
        Number(episode.file.duration),
      ),
    };

    return episodeFormated;
  });

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      allEpisodes,
      latestEpisodes,
    },
    revalidate: 60 * 60 * 24, // 24h
  };
};

export default Home;
