import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI'];

for (const key of required) {
  if (!process.env[key]) {
    // eslint-disable-next-line no-console
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'devposting-50cfb',
  clientUrl: process.env.CLIENT_URL || '*',
};

