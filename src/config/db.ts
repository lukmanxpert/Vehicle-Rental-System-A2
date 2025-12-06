import { Pool } from "pg";
import config from ".";

export const pool = new Pool({ connectionString: config.pg_connection_string });

const initDB = async () => {
  await pool.query(`
        
        `);
};

export default initDB;
