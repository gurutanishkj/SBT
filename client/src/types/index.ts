export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
}

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  language: string;
  format: string; // 2D, 3D
  certificate: string; // U, UA13+, UA16+, A
  genre: string;
  duration: number; // in mins
  rating: number;
  releaseDate: string;
  status: 'NOW_SHOWING' | 'COMING_SOON';
  description: string;
  director: string;
  cast: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl?: string;
  active: boolean;
  earliestShowtime?: string;
  availableShowtimesList?: string[];
  cinemaName?: string;
  cinemaAddress?: string;
  cinemaCity?: string;
  shows?: ShowSummary[];
}

export interface ShowSummary {
  id: string;
  date: string;
  startTime: string;
  screenName: string;
  screenId: string;
  priceClassic: number;
  pricePremium: number;
  priceRecliner: number;
  status: 'AVAILABLE' | 'FAST_FILLING' | 'SOLD_OUT' | 'DISABLED';
  bookedCount?: number;
  totalSeats?: number;
}

export interface Theatre {
  id: string;
  name: string;
  city: string;
  address: string;
  facilities: string;
  phone?: string;
  email?: string;
  screens?: Screen[];
}

export interface Screen {
  id: string;
  theatreId: string;
  name: string;
  screenNumber: number;
  totalSeats: number;
  soundSystem: string;
  projectionType: string;
  active: boolean;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  seatCode: string;
  tier: 'CLASSIC' | 'PREMIUM' | 'RECLINER';
  price: number;
  isOccupied: boolean;
}

export interface FoodItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  quantity?: number;
}

export interface Offer {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minAmount: number;
  maxDiscount: number;
}

export interface BookingSeat {
  id: string;
  seatId: string;
  seatCode: string;
  price: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  showId: string;
  totalAmount: number;
  convenienceFee: number;
  foodAmount: number;
  status: string;
  createdAt: string;
  show: {
    id: string;
    date: string;
    startTime: string;
    movie: Movie;
    screen: {
      id: string;
      name: string;
      soundSystem?: string;
      theatre: {
        name: string;
        address: string;
        city: string;
      };
    };
  };
  bookingSeats: BookingSeat[];
  foodOrders?: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    foodItem: FoodItem;
  }>;
  payment?: {
    transactionId: string;
    method: string;
    amount: number;
    status: string;
  };
}

export interface DateItem {
  dateString: string;
  dayName: string;
  dayNumber: string;
  monthName: string;
  fullLabel: string;
  isToday: boolean;
}
