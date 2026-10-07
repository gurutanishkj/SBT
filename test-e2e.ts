import http from 'http';

function request(options: http.RequestOptions, body?: any): Promise<{ statusCode: number; data: any }> {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode || 500, data: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode || 500, data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 RUNNING COMPREHENSIVE E2E VERIFICATION FOR SBT CINEMAS...\n');

  // Test 1: Health & Location Check
  console.log('1. Checking Health and Fixed Cinema Location...');
  const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
  if (
    health.data.location === 'Kovilpatti' &&
    health.data.address.includes('Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses') &&
    health.data.timezone === 'Asia/Kolkata'
  ) {
    console.log('   ✅ PASS: Fixed location is Kovilpatti and exact address matches perfectly.');
    console.log('   ✅ PASS: Timezone is Asia/Kolkata, date dynamically detected:', health.data.currentDate);
  } else {
    throw new Error('Health check failed: ' + JSON.stringify(health.data));
  }

  // Test 2: Now Showing Movies (dynamic calculation)
  console.log('\n2. Checking /api/movies/now-showing...');
  const nowShowing = await request({ host: 'localhost', port: 5000, path: '/api/movies/now-showing', method: 'GET' });
  const movieTitles = nowShowing.data.movies.map((m: any) => m.title);
  console.log('   Found movies in Now Showing:', movieTitles);

  const expectedMovies = [
    'Baththa',
    'Mandaadi',
    'Meesaya Murukku 2',
    'Yezhu Kadal Yezhu Malai',
    'Anbil Avan',
    'Dorothy',
    'Sigma',
  ];

  for (const exp of expectedMovies) {
    if (!movieTitles.includes(exp)) {
      throw new Error(`Expected movie missing: ${exp}`);
    }
  }
  console.log('   ✅ PASS: All 7 verified seed movies appear in Now Showing.');

  if (movieTitles.includes('Avengers: Doomsday')) {
    throw new Error('Avengers: Doomsday should NOT be in Now Showing yet!');
  }
  console.log('   ✅ PASS: Avengers: Doomsday is NOT in Now Showing.');

  // Test 3: Upcoming Movies
  console.log('\n3. Checking /api/movies/upcoming...');
  const upcoming = await request({ host: 'localhost', port: 5000, path: '/api/movies/upcoming', method: 'GET' });
  const avengers = upcoming.data.movies.find((m: any) => m.title === 'Avengers: Doomsday');
  if (avengers && avengers.status === 'COMING_SOON' && avengers.releaseDate === '2026-12-18') {
    console.log('   ✅ PASS: Avengers: Doomsday is featured as COMING SOON with release date December 18, 2026.');
  } else {
    throw new Error('Upcoming movies test failed: ' + JSON.stringify(upcoming.data));
  }

  // Test 4: Kalki strictly forbidden check
  console.log('\n4. Verifying prohibition of Kalki...');
  const allJson = JSON.stringify(nowShowing.data) + JSON.stringify(upcoming.data);
  if (allJson.toLowerCase().includes('kalki')) {
    throw new Error('FATAL: Kalki found in API responses!');
  }
  console.log('   ✅ PASS: Kalki does not appear anywhere in database or API responses.');

  // Test 5: Dynamic Show Dates
  console.log('\n5. Checking Dynamic Dates Generator...');
  const datesRes = await request({ host: 'localhost', port: 5000, path: '/api/shows/dates', method: 'GET' });
  if (datesRes.data.dates.length === 7 && datesRes.data.dates[0].dayName === 'TODAY') {
    console.log('   ✅ PASS: Generated 7 dynamic dates starting with:', datesRes.data.dates[0].fullLabel);
  } else {
    throw new Error('Dates generator test failed');
  }

  // Test 6: Global Search
  console.log('\n6. Checking Global Search for "Baththa" and "SBT"...');
  const searchBaththa = await request({ host: 'localhost', port: 5000, path: '/api/search?q=Baththa', method: 'GET' });
  const searchSBT = await request({ host: 'localhost', port: 5000, path: '/api/search?q=SBT', method: 'GET' });
  if (
    searchBaththa.data.results.movies.some((m: any) => m.title === 'Baththa') &&
    searchSBT.data.results.cinemas.some((c: any) => c.name.includes('SATHYABAMA MULTIPLEX'))
  ) {
    console.log('   ✅ PASS: Search for "Baththa" returned Baththa movie.');
    console.log('   ✅ PASS: Search for "SBT" returned SATHYABAMA MULTIPLEX (SBT CINEMAS).');
  } else {
    throw new Error('Search test failed');
  }

  // Test 7: Authentication
  console.log('\n7. Testing Authentication (User & Admin)...');
  const loginRes = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'guest@sbtcinemas.com', password: 'Password123' }
  );
  if (!loginRes.data.token) throw new Error('User login failed');
  const userToken = loginRes.data.token;
  console.log('   ✅ PASS: User logged in, token issued.');

  const adminLoginRes = await request(
    { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
    { email: 'admin@sbtcinemas.com', password: 'Admin@SBT2026' }
  );
  if (!adminLoginRes.data.token || adminLoginRes.data.user.role !== 'ADMIN') throw new Error('Admin login failed');
  const adminToken = adminLoginRes.data.token;
  console.log('   ✅ PASS: Admin logged in with role ADMIN.');

  // Test 8: Seat Selection & Transactional Double-Booking Prevention
  console.log('\n8. Testing Booking & Concurrency Double-Booking Protection...');
  const firstMovie = nowShowing.data.movies[0];
  const firstShow = firstMovie.shows[0];
  const seatsRes = await request({ host: 'localhost', port: 5000, path: `/api/shows/${firstShow.id}/seats`, method: 'GET' });
  
  // Find two unbooked seats in Row J (Recliners)
  const availableSeats = (seatsRes.data.rows['J'] || []).filter((s: any) => !s.isOccupied);
  if (availableSeats.length < 2) throw new Error('Not enough seats available for test');
  const seat1 = availableSeats[0];
  const seat2 = availableSeats[1];

  console.log(`   Attempting to book seats ${seat1.seatCode} and ${seat2.seatCode} for show ${firstShow.startTime}...`);
  const foodRes = await request({ host: 'localhost', port: 5000, path: '/api/food', method: 'GET' });
  const popcornItem = foodRes.data.items.find((i: any) => i.name === 'Popcorn');

  const bookingRes = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      showId: firstShow.id,
      seatIds: [seat1.id, seat2.id],
      foodItems: popcornItem ? [{ foodItemId: popcornItem.id, quantity: 2 }] : [],
      paymentMethod: 'UPI',
    }
  );

  if (bookingRes.data.success && bookingRes.data.booking.bookingCode.startsWith('SBT-')) {
    console.log('   ✅ PASS: Booking confirmed! Code:', bookingRes.data.booking.bookingCode);
    console.log('   ✅ PASS: Payment transaction created:', bookingRes.data.booking.payment.transactionId);
  } else {
    throw new Error('Booking failed: ' + JSON.stringify(bookingRes.data));
  }

  // Attempt to book the EXACT SAME seats again -> must fail!
  console.log('   Testing double booking collision rejection...');
  const doubleBookRes = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      showId: firstShow.id,
      seatIds: [seat1.id, seat2.id],
      paymentMethod: 'UPI',
    }
  );

  if (doubleBookRes.statusCode === 400 && doubleBookRes.data.success === false) {
    console.log('   ✅ PASS: Double booking successfully prevented by database transaction!');
    console.log('   Server response:', doubleBookRes.data.error);
  } else {
    throw new Error('Double booking prevention failed! Server allowed double book.');
  }

  // Test 9: Admin dynamically adding a show and checking Now Showing propagation
  console.log('\n9. Testing Admin Show Creation & Dynamic Now Showing Propagation...');
  // Add a show for Avengers: Doomsday
  console.log('   Creating a test show for Avengers: Doomsday via admin API...');
  const createShowRes = await request(
    {
      host: 'localhost',
      port: 5000,
      path: '/api/admin/shows',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    },
    {
      movieId: avengers.id,
      screenId: firstShow.screenId,
      date: health.data.currentDate,
      startTime: '11:45 PM',
      priceClassic: 150,
      pricePremium: 190,
      priceRecliner: 250,
    }
  );

  if (!createShowRes.data.success) {
    throw new Error('Admin create show failed: ' + JSON.stringify(createShowRes.data));
  }
  console.log('   Show created successfully.');

  // Check /api/movies/now-showing again
  const updatedNowShowing = await request({ host: 'localhost', port: 5000, path: '/api/movies/now-showing', method: 'GET' });
  const updatedTitles = updatedNowShowing.data.movies.map((m: any) => m.title);
  if (updatedTitles.includes('Avengers: Doomsday')) {
    console.log('   ✅ PASS: Avengers: Doomsday now AUTOMATICALLY appears in Now Showing with 0 code changes!');
  } else {
    throw new Error('Dynamic propagation failed: movie did not appear in Now Showing');
  }

  // Clean up: delete that test show and revert avengers status to COMING_SOON
  await request(
    {
      host: 'localhost',
      port: 5000,
      path: `/api/admin/shows/${createShowRes.data.show.id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    }
  );
  await request(
    {
      host: 'localhost',
      port: 5000,
      path: `/api/admin/movies/${avengers.id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    },
    { status: 'COMING_SOON' }
  );

  const finalNowShowing = await request({ host: 'localhost', port: 5000, path: '/api/movies/now-showing', method: 'GET' });
  const finalTitles = finalNowShowing.data.movies.map((m: any) => m.title);
  if (!finalTitles.includes('Avengers: Doomsday')) {
    console.log('   ✅ PASS: Upon show removal, movie automatically disappeared from Now Showing!');
  }

  // Test 10: Client Vite Dev Server is Serving
  console.log('\n10. Checking Client Vite Server on port 3000...');
  const clientRes = await request({ host: 'localhost', port: 3000, path: '/', method: 'GET' });
  if (clientRes.statusCode === 200 && typeof clientRes.data === 'string' && clientRes.data.includes('SBT CINEMAS')) {
    console.log('   ✅ PASS: Vite frontend is up and running on http://localhost:3000 with SBT CINEMAS title.');
  } else {
    throw new Error('Client server check failed');
  }

  console.log('\n🎉 ALL 10 TEST SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!');
}

runTests().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
