import mongoose from 'mongoose';
import { DB_URL, DB_URL_TEST, NODE_ENV } from '@Shared/utils/constants';

const ENVIRONMENT = {
  test: DB_URL_TEST,
  dev: DB_URL_TEST,
  production: DB_URL,
};

const connectionString = ENVIRONMENT[NODE_ENV];

export const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('🚀 DB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
