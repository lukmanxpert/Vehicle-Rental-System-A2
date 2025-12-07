import { Pool } from "pg";
import config from ".";

export const pool = new Pool({ connectionString: config.pg_connection_string });

const initDB = async () => {
  // create user's table
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL CHECK (LENGTH(password) >= 6),
        phone VARCHAR(15) NOT NULL,
        role TEXT CHECK (role IN ('admin', 'customer'))
        )
        `);
  // create vehicle table
  await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
      id SERIAL PRIMARY KEY,
      vehicle_name TEXT NOT NULL,
      type TEXT CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number TEXT NOT NULL UNIQUE,
      daily_rent_price INT NOT NULL CHECK (daily_rent_price >= 1),
      availability_status TEXT NOT NULL CHECK (availability_status IN ('available', 'booked'))
      )
    `);
  // create bookings table
  await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL,
      total_price NUMERIC(10,2) NOT NULL CHECK(total_price > 0),
      status TEXT CHECK(status IN ('active', 'cancelled', 'returned')),
      CHECK (rent_end_date > rent_start_date)
      )
    `);
};

export default initDB;
