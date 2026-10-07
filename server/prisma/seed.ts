import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { formatISTDate, getUpcomingDates } from '../src/utils/dateUtils';

const prisma = new PrismaClient();

async function main() {
  console.log('🎬 Seeding SBT CINEMAS database...');

  // 1. Clean existing records safely
  await prisma.notification.deleteMany();
  await prisma.foodOrder.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.show.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.theatre.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.foodItem.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing records.');

  // 2. Create Users
  const adminPassword = await bcrypt.hash('Admin@SBT2026', 10);
  const userPassword = await bcrypt.hash('Password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'SBT Kovilpatti Admin',
      email: 'admin@sbtcinemas.com',
      phone: '9842100001',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Karthik Raja',
      email: 'guest@sbtcinemas.com',
      phone: '9842109876',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log('👤 Created Admin and Demo User.');

  // 3. Create Primary Cinema
  const theatre = await prisma.theatre.create({
    data: {
      name: 'SATHYABAMA MULTIPLEX (SBT CINEMAS)',
      city: 'Kovilpatti',
      address: 'Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India',
      active: true,
      facilities: '4K Laser Projection, Dolby Atmos 3D, Recliner VIP Lounges, Gourmet Cafe, Ample Two & Four Wheeler Parking, Fast QR Check-in',
      phone: '+91 4632 220000',
      email: 'kovilpatti@sbtcinemas.com',
    },
  });

  console.log(`🏛️ Created Theatre: ${theatre.name}`);

  // 4. Create Screens
  const screen1 = await prisma.screen.create({
    data: {
      theatreId: theatre.id,
      name: 'Screen 1 - 4K Dolby Atmos',
      screenNumber: 1,
      totalSeats: 150,
      soundSystem: 'Dolby Atmos 64 Channel',
      projectionType: 'Barco 4K RGB Laser',
      active: true,
    },
  });

  const screen2 = await prisma.screen.create({
    data: {
      theatreId: theatre.id,
      name: 'Screen 2 - Dolby 7.1',
      screenNumber: 2,
      totalSeats: 120,
      soundSystem: 'Dolby 7.1 Surround Sound',
      projectionType: 'Christie Digital 2K/4K',
      active: true,
    },
  });

  // Populate Seats for Screen 1 (Rows A-J, 15 seats per row = 150 seats)
  // Rows A-E: CLASSIC (₹150), Rows F-H: PREMIUM (₹190), Rows I-J: RECLINER (₹250)
  const rows1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const screen1SeatsData = [];
  for (const row of rows1) {
    let tier = 'CLASSIC';
    let basePrice = 150;
    if (['F', 'G', 'H'].includes(row)) {
      tier = 'PREMIUM';
      basePrice = 190;
    } else if (['I', 'J'].includes(row)) {
      tier = 'RECLINER';
      basePrice = 250;
    }

    for (let num = 1; num <= 15; num++) {
      screen1SeatsData.push({
        screenId: screen1.id,
        row,
        number: num,
        seatCode: `${row}${num}`,
        tier,
        basePrice,
      });
    }
  }

  for (const seat of screen1SeatsData) {
    await prisma.seat.create({ data: seat });
  }

  // Populate Seats for Screen 2 (Rows A-H, 15 seats per row = 120 seats)
  const rows2 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const screen2SeatsData = [];
  for (const row of rows2) {
    let tier = 'CLASSIC';
    let basePrice = 150;
    if (['F', 'G'].includes(row)) {
      tier = 'PREMIUM';
      basePrice = 190;
    } else if (row === 'H') {
      tier = 'RECLINER';
      basePrice = 250;
    }

    for (let num = 1; num <= 15; num++) {
      screen2SeatsData.push({
        screenId: screen2.id,
        row,
        number: num,
        seatCode: `${row}${num}`,
        tier,
        basePrice,
      });
    }
  }

  for (const seat of screen2SeatsData) {
    await prisma.seat.create({ data: seat });
  }

  console.log('🪑 Created 270 seats across Screen 1 & Screen 2.');

  // 5. Seed Real-world Movies
  const movieBaththa = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  const movieMandaadi = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  const movieMeesayaMurukku2 = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  const movieYezhuKadal = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  const movieAnbilAvan = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  const movieDorothy = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  const movieSigma = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  // Upcoming major featured film
  const movieAvengers = await prisma.movie.create({
    data: {
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
      trailerUrl: null,
      active: true,
    },
  });

  console.log('🎥 Seeded 7 Now-Showing movies + 1 Featured Upcoming movie.');

  // 6. Create Shows dynamically for 7 days (starting today in IST)
  const upcomingDates = getUpcomingDates(7);
  console.log(`📅 Creating shows starting from ${upcomingDates[0].fullLabel}...`);

  for (const dateObj of upcomingDates) {
    const showDate = dateObj.dateString;

    // 1. Baththa: 10:30 AM, 02:20 PM, 06:20 PM, 10:15 PM
    const baththaTimes = ['10:30 AM', '02:20 PM', '06:20 PM', '10:15 PM'];
    for (const time of baththaTimes) {
      await prisma.show.create({
        data: {
          movieId: movieBaththa.id,
          screenId: screen1.id,
          date: showDate,
          startTime: time,
          priceClassic: 150,
          pricePremium: 190,
          priceRecliner: 250,
          active: true,
        },
      });
    }

    // 2. Mandaadi: 02:20 PM, 06:20 PM, 10:15 PM
    const mandaadiTimes = ['02:20 PM', '06:20 PM', '10:15 PM'];
    for (const time of mandaadiTimes) {
      await prisma.show.create({
        data: {
          movieId: movieMandaadi.id,
          screenId: screen2.id,
          date: showDate,
          startTime: time,
          priceClassic: 150,
          pricePremium: 190,
          priceRecliner: 250,
          active: true,
        },
      });
    }

    // 3. Meesaya Murukku 2: 10:30 AM, 02:20 PM, 06:20 PM
    const meesayaTimes = ['10:30 AM', '02:20 PM', '06:20 PM'];
    for (const time of meesayaTimes) {
      await prisma.show.create({
        data: {
          movieId: movieMeesayaMurukku2.id,
          screenId: screen1.id,
          date: showDate,
          startTime: time,
          priceClassic: 150,
          pricePremium: 190,
          priceRecliner: 250,
          active: true,
        },
      });
    }

    // 4. Yezhu Kadal Yezhu Malai: 03:30 PM
    await prisma.show.create({
      data: {
        movieId: movieYezhuKadal.id,
        screenId: screen2.id,
        date: showDate,
        startTime: '03:30 PM',
        priceClassic: 150,
        pricePremium: 190,
        priceRecliner: 250,
        active: true,
      },
    });

    // 5. Anbil Avan: 10:30 AM, 06:30 PM
    const anbilTimes = ['10:30 AM', '06:30 PM'];
    for (const time of anbilTimes) {
      await prisma.show.create({
        data: {
          movieId: movieAnbilAvan.id,
          screenId: screen2.id,
          date: showDate,
          startTime: time,
          priceClassic: 150,
          pricePremium: 190,
          priceRecliner: 250,
          active: true,
        },
      });
    }

    // 6. Dorothy: 12:40 PM, 10:15 PM
    const dorothyTimes = ['12:40 PM', '10:15 PM'];
    for (const time of dorothyTimes) {
      await prisma.show.create({
        data: {
          movieId: movieDorothy.id,
          screenId: screen2.id,
          date: showDate,
          startTime: time,
          priceClassic: 150,
          pricePremium: 190,
          priceRecliner: 250,
          active: true,
        },
      });
    }

    // 7. Sigma: 10:20 AM, 10:15 PM
    const sigmaTimes = ['10:20 AM', '10:15 PM'];
    for (const time of sigmaTimes) {
      await prisma.show.create({
        data: {
          movieId: movieSigma.id,
          screenId: screen1.id,
          date: showDate,
          startTime: time,
          priceClassic: 150,
          pricePremium: 190,
          priceRecliner: 250,
          active: true,
        },
      });
    }
  }

  console.log('🎟️ Created all shows for 7 consecutive days.');

  // 7. Seed Food & Beverages
  const foods = [
    {
      name: 'Popcorn',
      category: 'Snacks',
      price: 120,
      description: 'Crispy, freshly-popped golden salted corn kernels made with coconut oil.',
      imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Large Popcorn',
      category: 'Snacks',
      price: 190,
      description: 'Jumbo bucket of warm theater-style melted butter popcorn.',
      imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Nachos',
      category: 'Snacks',
      price: 150,
      description: 'Crispy stone-ground corn tortilla chips served with warm melted jalapeno cheese sauce and tangy salsa.',
      imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Soft Drink',
      category: 'Beverages',
      price: 90,
      description: 'Ice-chilled refreshing carbonated beverage (Coke / Sprite / Thums Up 500ml).',
      imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Combo',
      category: 'Combos',
      price: 190,
      description: 'Classic single combo: 1 Regular Salted Popcorn + 1 Chilled Beverage 500ml.',
      imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?w=600&auto=format&fit=crop&q=80',
    },
    {
      name: 'Premium Combo',
      category: 'Combos',
      price: 390,
      description: 'Ultimate sharing combo: 1 Large Butter Popcorn + 2 Chilled Soft Drinks + 1 Crispy Cheesy Nachos.',
      imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=600&auto=format&fit=crop&q=80',
    },
  ];

  for (const food of foods) {
    await prisma.foodItem.create({ data: food });
  }

  console.log('🍿 Seeded Food & Beverage items.');

  // 8. Seed Offers
  const offers = [
    {
      code: 'WEEKEND50',
      title: 'Weekend Special',
      description: 'Flat ₹50 OFF on booking 2 or more tickets for Saturday and Sunday shows.',
      discountType: 'FLAT',
      discountValue: 50,
      minAmount: 300,
      maxDiscount: 50,
      validTill: new Date('2026-12-31'),
    },
    {
      code: 'STUDENT20',
      title: 'Student Offer',
      description: 'Flat 20% discount up to ₹80 for students with valid institutional identification.',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      minAmount: 150,
      maxDiscount: 80,
      validTill: new Date('2026-12-31'),
    },
    {
      code: 'MOVIENIGHT',
      title: 'Movie Night',
      description: 'Special late-night cinephile offer: Flat ₹40 OFF on all 10:15 PM showtimes.',
      discountType: 'FLAT',
      discountValue: 40,
      minAmount: 200,
      maxDiscount: 40,
      validTill: new Date('2026-12-31'),
    },
    {
      code: 'COMBO25',
      title: 'Food Combo Offer',
      description: 'Save 25% up to ₹100 on all gourmet combo snacks added during ticket checkout.',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minAmount: 250,
      maxDiscount: 100,
      validTill: new Date('2026-12-31'),
    },
  ];

  for (const offer of offers) {
    await prisma.offer.create({ data: offer });
  }

  console.log('🏷️ Seeded Offers & Discounts.');

  // 9. Seed a sample past booking for demo user so "My Bookings" has immediate rich preview
  const firstTodayShow = await prisma.show.findFirst({
    where: { movieId: movieBaththa.id, date: upcomingDates[0].dateString },
  });

  if (firstTodayShow) {
    const seatE7 = await prisma.seat.findFirst({ where: { screenId: screen1.id, seatCode: 'E7' } });
    const seatE8 = await prisma.seat.findFirst({ where: { screenId: screen1.id, seatCode: 'E8' } });

    if (seatE7 && seatE8) {
      const demoBooking = await prisma.booking.create({
        data: {
          bookingCode: 'SBT-8F42K9',
          userId: demoUser.id,
          showId: firstTodayShow.id,
          totalAmount: 335.40,
          convenienceFee: 35.40,
          foodAmount: 0,
          status: 'CONFIRMED',
          createdAt: new Date(),
        },
      });

      await prisma.bookingSeat.create({
        data: {
          bookingId: demoBooking.id,
          seatId: seatE7.id,
          showId: firstTodayShow.id,
          seatCode: seatE7.seatCode,
          price: seatE7.basePrice,
        },
      });

      await prisma.bookingSeat.create({
        data: {
          bookingId: demoBooking.id,
          seatId: seatE8.id,
          showId: firstTodayShow.id,
          seatCode: seatE8.seatCode,
          price: seatE8.basePrice,
        },
      });

      await prisma.payment.create({
        data: {
          bookingId: demoBooking.id,
          transactionId: 'TXN-984210',
          method: 'UPI',
          amount: 335.40,
          status: 'SUCCESS',
        },
      });

      await prisma.favorite.create({
        data: {
          userId: demoUser.id,
          movieId: movieBaththa.id,
        },
      });
    }
  }

  console.log('✅ SBT CINEMAS database seeded successfully with 100% verified real data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
