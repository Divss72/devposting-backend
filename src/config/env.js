import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || 'devposting-50cfb',
  clientUrl: process.env.CLIENT_URL || '*',
};
