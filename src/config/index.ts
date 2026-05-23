import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  postgreSQL_DB: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  bc_crypt_round: process.env.BC_CRYPT_SALT_ROUND,
};
