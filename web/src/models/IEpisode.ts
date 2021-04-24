export interface IEpisode {
  id: string;
  title: string;
  members: string;
  description: string;
  thumbnail: string;
  published_at: string;
  file: {
    url: string;
    duration: number;
  };
}

export interface IEpisodeFormated extends IEpisode {
  publishedAtFormated: string;
  durationFormated: string;
}
