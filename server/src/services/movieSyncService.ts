import prisma from '../prisma';

export interface MovieSyncPayload {
  title: string;
  originalTitle?: string;
  language: string;
  format: string;
  certificate: string;
  genre: string;
  duration: number;
  rating: number;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'COMING_SOON';
  description: string;
  director: string;
  cast: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  active?: boolean;
}

export class MovieSyncService {
  /**
   * Syncs a movie from an external feed or admin payload
   */
  static async syncMovie(payload: MovieSyncPayload) {
    // Safety check against forbidden titles
    if (payload.title.toLowerCase().includes('kalki')) {
      throw new Error('Movie not permitted');
    }

    const existing = await prisma.movie.findFirst({
      where: {
        title: {
          equals: payload.title,
        },
      },
    });

    if (existing) {
      return prisma.movie.update({
        where: { id: existing.id },
        data: {
          ...payload,
          active: payload.active ?? existing.active,
        },
      });
    }

    return prisma.movie.create({
      data: {
        ...payload,
        active: payload.active ?? true,
      },
    });
  }

  /**
   * Bulk sync movie catalog
   */
  static async syncCatalog(movies: MovieSyncPayload[]) {
    const results = [];
    for (const movie of movies) {
      if (!movie.title.toLowerCase().includes('kalki')) {
        const synced = await this.syncMovie(movie);
        results.push(synced);
      }
    }
    return results;
  }
}

export default MovieSyncService;
