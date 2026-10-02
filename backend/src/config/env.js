import dotenv from 'dotenv';
dotenv.config();
const required = ['DATABASE_URL', 'JWT_SECRET'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}
if (
  process.env.NODE_ENV === 'production' &&
  process.env.JWT_SECRET === 'change-this-secret-before-production'
)
  throw new Error('JWT_SECRET must be changed in production');
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
