# SBT CINEMAS — Real-Time Cinema Booking Website
**Location: Sathyabama Multiplex, Kovilpatti**

A production-style full-stack cinema booking web application for **SBT CINEMAS (Sathyabama Multiplex, Kovilpatti)** built with Node.js, Express, TypeScript, Prisma ORM, React, Vite, and Tailwind CSS.

---

## 📍 Fixed Cinema Information
* **Primary Cinema**: SATHYABAMA MULTIPLEX (SBT CINEMAS)
* **Official Address**: Kovilpatti Main Road, Iluppaiyurani, Near Sangeetha Dresses, Kovilpatti, Tamil Nadu 628501, India
* **Navbar Location**: 📍 Kovilpatti (Permanent location, no city selector, no GPS prompt)
* **Auditoriums**:
  * **Screen 1**: 4K Dolby Atmos (150 Seats, Rows A–J: Classic ₹150, Premium ₹190, Recliner VIP ₹250)
  * **Screen 2**: Dolby 7.1 Surround (120 Seats, Rows A–H)

---

## 🎬 Real-World Movie Seed Data (Kovilpatti)

### NOW SHOWING
1. **Baththa** (Tamil • 2D • UA13+ • Showtimes: 10:30 AM, 02:20 PM, 06:20 PM, 10:15 PM)
2. **Mandaadi** (Tamil • 2D • UA16+ • Showtimes: 02:20 PM, 06:20 PM, 10:15 PM)
3. **Meesaya Murukku 2** (Tamil • 2D • UA13+ • Showtimes: 10:30 AM, 02:20 PM, 06:20 PM)
4. **Yezhu Kadal Yezhu Malai** (Tamil • 2D • UA16+ • Showtime: 03:30 PM)
5. **Anbil Avan** (Tamil • 2D • UA16+ • Showtimes: 10:30 AM, 06:30 PM)
6. **Dorothy** (Tamil • 2D • A • Showtimes: 12:40 PM, 10:15 PM)
7. **Sigma** (Tamil • 2D • UA16+ • Showtimes: 10:20 AM, 10:15 PM)

### UPCOMING FEATURED FILM
* **Avengers: Doomsday** (Status: COMING SOON • Release: December 18, 2026 • Format: 3D / 2D • No active shows until scheduled by admin)

*Note: Kalki 2898 AD is strictly excluded from all database records, APIs, UI, and search results.*

---

## ⚡ Dynamic Features & Architecture
1. **Dynamic Now-Showing Engine**:
   Movies only appear under `/api/movies/now-showing` when `movie.active = true AND theatre.active = true AND theatre.city = 'Kovilpatti' AND show.active = true AND show.date >= current_date`.
   Adding a show via Admin Panel automatically makes any movie appear in Now Showing without frontend edits.
2. **Dynamic Date Engine (IST / Asia/Kolkata)**:
   Date selector dynamically computes `TODAY`, `THU 08 OCT`, `FRI 09 OCT`, etc. from server time.
3. **Interactive Seating Map**:
   Rows A to J with tiered pricing (Classic, Premium, Recliner). Double booking is strictly prevented using atomic database transactions.
4. **Food & Drinks**:
   Popcorn, Large Butter Popcorn, Cheesy Nachos, Soft Drinks, Single Combos, and Sharing Combos with interactive quantity adjustment.
5. **Demo Payment & Digital Ticket**:
   Instant payment confirmation with unique Booking ID (`SBT-XXXXXX`), Transaction ID (`TXN-XXXXXX`), and scannable QR-code digital pass.
6. **Admin Dashboard**:
   Live metrics for revenue, bookings, user count, and seat occupancy, plus full movie and show scheduling tools.

---

## 🚀 Running Locally

### Backend Server (Port 5000)
```bash
cd server
npm install
npm run seed     # Seeds database with real Kovilpatti cinema data
npm run dev      # Starts Express API at http://localhost:5000
```

### Frontend Client (Port 3000)
```bash
cd client
npm install
npm run dev      # Starts Vite React application at http://localhost:3000
```

### Pre-configured Demo Accounts
* **Patron**: `guest@sbtcinemas.com` / `Password123`
* **Admin**: `admin@sbtcinemas.com` / `Admin@SBT2026`
