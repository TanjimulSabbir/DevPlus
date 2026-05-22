import { Pool } from "pg";
import { config } from "../config";
export const pool = new Pool({
  connectionString: config.postgreSQL_DB,
});

export const intiDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'contributor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL CHECK (char_length(title) <= 150),

    description TEXT NOT NULL CHECK (char_length(description) >= 20),

    type VARCHAR(30) NOT NULL CHECK (type IN ('bug', 'feature_request')),

    status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),

    reporter_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log(error);
  }
};
