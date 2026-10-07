import React, { createContext, useContext, useState } from 'react';
import { Movie, Seat, FoodItem, Offer } from '../types';

interface BookingContextType {
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedShow: any | null;
  setSelectedShow: (show: any | null) => void;
  selectedSeats: Seat[];
  toggleSeat: (seat: Seat) => void;
  clearSeats: () => void;
  foodQuantities: { [key: string]: number };
  updateFoodQuantity: (foodId: string, delta: number) => void;
  appliedOffer: Offer | null;
  applyOffer: (offer: Offer | null) => void;
  convenienceFee: number;
  ticketTotal: number;
  foodTotal: number;
  discountAmount: number;
  grandTotal: number;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedShow, setSelectedShow] = useState<any | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [foodQuantities, setFoodQuantities] = useState<{ [key: string]: number }>({});
  const [foodPrices, setFoodPrices] = useState<{ [key: string]: number }>({
    'Popcorn': 120,
    'Large Popcorn': 190,
    'Nachos': 150,
    'Soft Drink': 90,
    'Combo': 190,
    'Premium Combo': 390,
  });
  const [appliedOffer, setAppliedOffer] = useState<Offer | null>(null);

  const convenienceFee = selectedSeats.length > 0 ? 35.40 : 0;

  const toggleSeat = (seat: Seat) => {
    if (seat.isOccupied) return;

    setSelectedSeats((prev) => {
      const exists = prev.some((s) => s.id === seat.id);
      if (exists) {
        return prev.filter((s) => s.id !== seat.id);
      } else {
        if (prev.length >= 8) {
          alert('You can select a maximum of 8 seats per booking.');
          return prev;
        }
        return [...prev, seat];
      }
    });
  };

  const clearSeats = () => {
    setSelectedSeats([]);
  };

  const updateFoodQuantity = (foodId: string, delta: number) => {
    setFoodQuantities((prev) => {
      const current = prev[foodId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[foodId];
        return copy;
      }
      return { ...prev, [foodId]: next };
    });
  };

  const applyOffer = (offer: Offer | null) => {
    setAppliedOffer(offer);
  };

  const ticketTotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  // We calculate food total dynamically based on known item prices passed in
  const [foodItemMap, setFoodItemMap] = useState<{ [id: string]: number }>({});

  const foodTotal = Object.entries(foodQuantities).reduce((acc, [id, qty]) => {
    const price = foodItemMap[id] || 150;
    return acc + price * qty;
  }, 0);

  // Compute discount
  let discountAmount = 0;
  if (appliedOffer) {
    const subtotal = ticketTotal + foodTotal;
    if (subtotal >= appliedOffer.minAmount) {
      if (appliedOffer.discountType === 'FLAT') {
        discountAmount = Math.min(appliedOffer.discountValue, appliedOffer.maxDiscount);
      } else {
        discountAmount = Math.min((subtotal * appliedOffer.discountValue) / 100, appliedOffer.maxDiscount);
      }
    }
  }

  const grandTotal = Math.max(0, ticketTotal + convenienceFee + foodTotal - discountAmount);

  const resetBooking = () => {
    setSelectedSeats([]);
    setFoodQuantities({});
    setAppliedOffer(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedDate,
        setSelectedDate,
        selectedShow,
        setSelectedShow,
        selectedSeats,
        toggleSeat,
        clearSeats,
        foodQuantities,
        updateFoodQuantity,
        appliedOffer,
        applyOffer,
        convenienceFee,
        ticketTotal,
        foodTotal,
        discountAmount,
        grandTotal,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
