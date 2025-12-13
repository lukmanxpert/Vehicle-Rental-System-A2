# 🚗 Vehicle Rental System

**Live URL:** https://vehicle-rental-system-a2-gold.vercel.app/

A role-based **Vehicle Rental System backend API** built with **Node.js, Express, TypeScript, and PostgreSQL (Neon)**. The system supports vehicle booking, cancellation, returns, and secure authentication using JWT, following real-world business rules.

---

## ✨ Features

### 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (**Admin / Customer**)
- Secure password hashing with **bcrypt**

### 🚘 Vehicle Management

- Vehicles with availability status (`available`, `booked`)
- Vehicle types: `car`, `bike`, `van`, `SUV`

### 📅 Booking Management

- Customers can:

  - Create bookings
  - View only their own bookings
  - Cancel bookings **before start date only**

- Admins can:
  - View all bookings
  - Mark bookings as **returned**
  - Automatically update vehicle availability

### 🧠 Business Rules Enforced

- Customers cannot cancel after rental start date
- Admins can only mark bookings as `returned`
- Vehicle availability updates automatically on cancel/return
- Secure relational integrity using PostgreSQL constraints

---

## 🛠️ Technology Stack

### Backend

- **Node.js**
- **Express.js (v5)**
- **TypeScript**

### Database

- **PostgreSQL**
- Hosted on **Neon**
- Raw SQL queries using **pg** (no ORM)

### Security & Utilities

- **JWT (jsonwebtoken)** for authentication
- **bcryptjs** for password hashing
- **dotenv** for environment variables

### Deployment

- **Vercel**

---

## 📦 NPM Packages Used

```json
express, typescript, pg, jsonwebtoken, bcryptjs, dotenv, tsx
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```env
PG_CONNECTION_STRING=your_neon_postgres_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
```

---

## 🚀 Setup & Usage Instructions

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd vehicle-rental-system-a2
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create a `.env` file and add required variables (see above).

### 4️⃣ Run Database Initialization

Ensure your PostgreSQL database is accessible (Neon).
Tables will be created automatically on server start.

### 5️⃣ Run the Project (Development)

```bash
npm run dev
```

### 6️⃣ Build for Production

```bash
npm run build
```

---

## 🔗 API Overview

### Authentication

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Vehicles

- `GET /api/v1/vehicles`

### Bookings

- `POST /api/v1/bookings`
- `GET /api/v1/bookings` (role-based)
- `PUT /api/v1/bookings/:bookingId` (cancel / return)

---

## 📌 Project Highlights

- Clean service-controller architecture
- Strong focus on **business logic correctness**
- Secure role-based API design
- Production-ready PostgreSQL schema
- Beginner-friendly, readable codebase

---

## 👨‍💻 Author

**Vehicle Rental System**

Built with ❤️ using Node.js, TypeScript, and PostgreSQL.

---

## 📄 License

This project is licensed under the **ISC License**.
