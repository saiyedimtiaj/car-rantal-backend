import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  bcrypt_salt_round: Number(process.env.BCRYPT_SALT_ROUND),
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_secret_expirein: process.env.JWT_ACCESS_EXPIREIN,
};
