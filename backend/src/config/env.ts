import dotenv from "dotenv";
dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  PORT: process.env.PORT || "5000",
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: required("DATABASE_URL"),
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
};