import prisma from '../prisma';
import { formatISTDate } from '../utils/dateUtils';

export class ShowtimeSyncService {
  /**
   * Determine show status based on occupancy and active flag
   */
  static async getShowStatus(showId: string): Promise<'AVAILABLE' | 'FAST_FILLING' | 'SOLD_OUT' | 'DISABLED'> {
    const show = await prisma.show.findUnique({
      where: { id: showId },
      include: {
        screen: true,
        bookingSeats: true,
      },
    });

    if (!show || !show.active || !show.screen.active) {
      return 'DISABLED';
    }

    const totalSeats = show.screen.totalSeats || 150;
    const bookedCount = show.bookingSeats.length;

    if (bookedCount >= totalSeats) {
      return 'SOLD_OUT';
    }

    const occupancyRate = bookedCount / totalSeats;
    if (occupancyRate >= 0.75) {
      return 'FAST_FILLING';
    }

    return 'AVAILABLE';
  }

  /**
   * Cleans up or archives expired shows older than current date in IST
   */
  static async archiveExpiredShows() {
    const today = formatISTDate();
    const result = await prisma.show.updateMany({
      where: {
        date: {
          lt: today,
        },
        active: true,
      },
      data: {
        active: false,
      },
    });
    return result;
  }
}

export default ShowtimeSyncService;
