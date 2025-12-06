import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  pg_connection_string: process.env.PG_CONNECTION_STRING,
  port: process.env.PORT,
};

export default config;
