import { config } from "dotenv";
config();
const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_NAME = process.env.MONGODB_NAME || "tiendaSol"
const JWT_SECRET = process.env.JWT_SECRET_KEY
const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP
const REFRESH_TOKEN_EXP = process.env.REFRESH_TOKEN_EXP
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN

export default {
  PORT,
  MONGODB_URI,
  MONGODB_NAME,
  JWT_SECRET,
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
  AWS_BUCKET_NAME,
  AWS_BUCKET_REGION,
  AWS_ACCESS_KEY,
  AWS_SECRET_KEY,
  ALLOWED_ORIGIN
}