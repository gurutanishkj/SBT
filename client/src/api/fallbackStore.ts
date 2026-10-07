import { Movie, Theatre, Seat, FoodItem, Offer, Booking } from '../types';

export const THEATRE_KOVILPATTI: Theatre = {
  id: 'theatre-sbt-kovilpatti',
  name: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
  city: 'Kovilpatti',
  address: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  facilities: '4K Laser Projection, Dolby Atmos 3D, Recliner VIP Lounges, Gourmet Cafe, Ample Two & Four Wheeler Parking, Fast QR Check-in',
  phone: '+91 4632 220000',
  email: 'kovilpatti@sbtcinemas.com',
  screens: [
    {
      id: 'screen-1-atmos',
      theatreId: 'theatre-sbt-kovilpatti',
      name: 'Screen 1 - 4K Dolby Atmos',
      screenNumber: 1,
      totalSeats: 150,
      soundSystem: 'Dolby Atmos 64 Channel',
      projectionType: 'Barco 4K RGB Laser',
      active: true,
    },
    {
      id: 'screen-2-surround',
      theatreId: 'theatre-sbt-kovilpatti',
      name: 'Screen 2 - Dolby 7.1',
      screenNumber: 2,
      totalSeats: 120,
      soundSystem: 'Dolby 7.1 Linear Cinema Audio',
      projectionType: 'Christie Digital 2K/4K',
      active: true,
    },
  ],
};

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'mov-baththa',
    title: 'Baththa',
    language: 'Tamil',
    format: '2D',
    certificate: 'UA13+',
    genre: 'Action / Mass Drama',
    duration: 148,
    rating: 8.8,
    releaseDate: '2026-10-02',
    status: 'NOW_SHOWING',
    description: 'A relentless mass-action saga set against high-stakes rural conflicts, showcasing indomitable courage, local pride, and raw family loyalty.',
    director: 'S. Muthukumar',
    cast: 'Sathish, Ananya, Prakash Raj, Samuthirakani',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['10:30 AM', '02:20 PM', '06:20 PM', '10:15 PM'],
    earliestShowtime: '10:30 AM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-mandaadi',
    title: 'Mandaadi',
    language: 'Tamil',
    format: '2D',
    certificate: 'UA16+',
    genre: 'Crime / Maritime Thriller',
    duration: 139,
    rating: 8.4,
    releaseDate: '2026-10-04',
    status: 'NOW_SHOWING',
    description: 'An atmospheric coastal thriller revolving around deep-sea mysteries, high-seas smuggling networks, and an undercover investigation in Tuticorin.',
    director: 'R. K. Vignesh',
    cast: 'Kathir, Divya Bharati, Guru Somasundaram, Kishore',
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['02:20 PM', '06:20 PM', '10:15 PM'],
    earliestShowtime: '02:20 PM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-meesaya2',
    title: 'Meesaya Murukku 2',
    language: 'Tamil',
    format: '2D',
    certificate: 'UA13+',
    genre: 'Musical / College Romance / Drama',
    duration: 142,
    rating: 8.6,
    releaseDate: '2026-10-01',
    status: 'NOW_SHOWING',
    description: 'The energetic musical sequel tracing youthful dreams, college campus triumphs, underground music battles, and unapologetic self-belief.',
    director: 'Hiphop Tamizha Aadhi',
    cast: 'Hiphop Tamizha Aadhi, Aathmika, Vivek, RJ Vigneshkanth',
    posterUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['10:30 AM', '02:20 PM', '06:20 PM'],
    earliestShowtime: '10:30 AM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-yezhu-kadal',
    title: 'Yezhu Kadal Yezhu Malai',
    language: 'Tamil',
    format: '2D',
    certificate: 'UA16+',
    genre: 'Poetic Drama / Romance / Fantasy',
    duration: 135,
    rating: 9.1,
    releaseDate: '2026-09-28',
    status: 'NOW_SHOWING',
    description: 'A mesmerizing philosophical odyssey about timeless love, human endurance, and empathy that traverses centuries and mythical landscapes.',
    director: 'Ram',
    cast: 'Nivin Pauly, Soori, Anjali',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['03:30 PM'],
    earliestShowtime: '03:30 PM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-anbil-avan',
    title: 'Anbil Avan',
    language: 'Tamil',
    format: '2D',
    certificate: 'UA16+',
    genre: 'Emotional Family Drama',
    duration: 130,
    rating: 8.2,
    releaseDate: '2026-10-05',
    status: 'NOW_SHOWING',
    description: 'A heart-touching exploration of fatherhood, quiet resilience, and redemption in the bustling towns of South Tamil Nadu.',
    director: 'K. Balaji',
    cast: 'Vijay Antony, Sarathkumar, Mirnalini Ravi',
    posterUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['10:30 AM', '06:30 PM'],
    earliestShowtime: '10:30 AM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-dorothy',
    title: 'Dorothy',
    language: 'Tamil',
    format: '2D',
    certificate: 'A',
    genre: 'Horror / Psychological Mystery',
    duration: 126,
    rating: 8.0,
    releaseDate: '2026-10-03',
    status: 'NOW_SHOWING',
    description: 'An eerie period psychological horror story about an isolated colonial manor shrouded in unexplained disappearances and nocturnal whispers.',
    director: 'Stephen Raj',
    cast: 'Andrea Jeremiah, Rahman, Atul Kulkarni',
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['12:40 PM', '10:15 PM'],
    earliestShowtime: '12:40 PM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-sigma',
    title: 'Sigma',
    language: 'Tamil',
    format: '2D',
    certificate: 'UA16+',
    genre: 'Action / Cyber Espionage',
    duration: 140,
    rating: 8.5,
    releaseDate: '2026-10-06',
    status: 'NOW_SHOWING',
    description: 'A relentless cyber warfare operative battles an elusive global syndicate targeting critical energy grids across peninsular India.',
    director: 'Praveen Kumar',
    cast: 'Arun Vijay, Priya Bhavani Shankar, Jackie Shroff',
    posterUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    active: true,
    availableShowtimesList: ['10:20 AM', '10:15 PM'],
    earliestShowtime: '10:20 AM',
    cinemaName: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
    cinemaCity: 'Kovilpatti',
    cinemaAddress: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
  },
  {
    id: 'mov-avengers',
    title: 'Avengers: Doomsday',
    language: 'English / Tamil / Hindi',
    format: '3D / 2D',
    certificate: 'UA13+',
    genre: 'Action / Adventure / Superhero',
    duration: 165,
    rating: 9.6,
    releaseDate: '2026-12-18',
    status: 'COMING_SOON',
    description: 'The Marvel Multiverse faces ultimate doom as Victor Von Doom rises. Earth’s mightiest champions must forge desperate alliances across timelines to stave off total annihilation.',
    director: 'Anthony Russo, Joe Russo',
    cast: 'Robert Downey Jr., Pedro Pascal, Benedict Cumberbatch, Anthony Mackie, Florence Pugh',
    posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&auto=format&fit=crop&q=80',
    active: true,
  },
];

export const FOOD_ITEMS: FoodItem[] = [
  {
    id: 'food-1',
    name: 'Popcorn',
    category: 'Snacks',
    price: 120,
    description: 'Crispy, freshly-popped golden salted corn kernels made with coconut oil.',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'food-2',
    name: 'Large Popcorn',
    category: 'Snacks',
    price: 190,
    description: 'Jumbo bucket of warm theater-style melted butter popcorn.',
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'food-3',
    name: 'Nachos',
    category: 'Snacks',
    price: 150,
    description: 'Crispy stone-ground corn tortilla chips served with warm melted jalapeno cheese sauce and tangy salsa.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'food-4',
    name: 'Soft Drink',
    category: 'Beverages',
    price: 90,
    description: 'Ice-chilled refreshing carbonated beverage (Coke / Sprite / Thums Up 500ml).',
    imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'food-5',
    name: 'Combo',
    category: 'Combos',
    price: 190,
    description: 'Classic single combo: 1 Regular Salted Popcorn + 1 Chilled Beverage 500ml.',
    imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'food-6',
    name: 'Premium Combo',
    category: 'Combos',
    price: 390,
    description: 'Ultimate sharing combo: 1 Large Butter Popcorn + 2 Chilled Soft Drinks + 1 Crispy Cheesy Nachos.',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80',
  },
];

export const OFFERS: Offer[] = [
  {
    id: 'off-1',
    code: 'WEEKEND50',
    title: 'Weekend Special',
    description: 'Flat ₹50 OFF on booking 2 or more tickets for Saturday and Sunday shows.',
    discountType: 'FLAT',
    discountValue: 50,
    minAmount: 300,
    maxDiscount: 50,
  },
  {
    id: 'off-2',
    code: 'STUDENT20',
    title: 'Student Offer',
    description: 'Flat 20% discount up to ₹80 for students with valid institutional identification.',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minAmount: 150,
    maxDiscount: 80,
  },
  {
    id: 'off-3',
    code: 'MOVIENIGHT',
    title: 'Movie Night',
    description: 'Special late-night cinephile offer: Flat ₹40 OFF on all 10:15 PM showtimes.',
    discountType: 'FLAT',
    discountValue: 40,
    minAmount: 200,
    maxDiscount: 40,
  },
  {
    id: 'off-4',
    code: 'COMBO25',
    title: 'Food Combo Offer',
    description: 'Save 25% up to ₹100 on all gourmet combo snacks added during ticket checkout.',
    discountType: 'PERCENTAGE',
    discountValue: 25,
    minAmount: 250,
    maxDiscount: 100,
  },
];

// Generate upcoming dates dynamically in IST
export function getFallbackDates() {
  const dates = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const target = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const dateString = target.toISOString().split('T')[0];
    const isToday = i === 0;

    const weekdayShort = target.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const dayNumber = String(target.getDate()).padStart(2, '0');
    const monthName = target.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const dayName = isToday ? 'TODAY' : weekdayShort;

    dates.push({
      dateString,
      dayName,
      dayNumber,
      monthName,
      fullLabel: `${dayName} — ${dayNumber} ${monthName}`,
      isToday,
    });
  }
  return dates;
}

// Generate rows A-J for seat layout
export function generateFallbackSeats(screenName: string, showId: string) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const rowsMap: { [row: string]: Seat[] } = {};

  // Retrieve already booked seats for this show from localStorage
  const bookedKey = `sbt_booked_seats_${showId}`;
  const bookedList: string[] = JSON.parse(localStorage.getItem(bookedKey) || '["E7","E8"]');

  for (const row of rows) {
    let tier: 'CLASSIC' | 'PREMIUM' | 'RECLINER' = 'CLASSIC';
    let price = 150;
    if (['F', 'G', 'H'].includes(row)) {
      tier = 'PREMIUM';
      price = 190;
    } else if (['I', 'J'].includes(row)) {
      tier = 'RECLINER';
      price = 250;
    }

    rowsMap[row] = [];
    for (let num = 1; num <= 15; num++) {
      const seatCode = `${row}${num}`;
      rowsMap[row].push({
        id: `seat-${showId}-${seatCode}`,
        row,
        number: num,
        seatCode,
        tier,
        price,
        isOccupied: bookedList.includes(seatCode),
      });
    }
  }

  return rowsMap;
}
