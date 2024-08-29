import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  bcrypt_salt_round: Number(process.env.BCRYPT_SALT_ROUND),
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_secret_expirein: process.env.JWT_ACCESS_EXPIREIN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIREIN,
  amarpay_baseurl: process.env.BASEURL,
  amarpay_storeId: process.env.STOREID,
  amarpay_signaturekey: process.env.SIGNATUREKEY,
  payment_verify_url: process.env.PAYMENT_VERIFY_URL,
};
