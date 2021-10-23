import mongoose from 'mongoose';
require('dotenv').config({ path: 'src/variables.env' });
const { DB_URL, DB_URL_TEST, NODE_ENV } = process.env;

const connectionString =
  NODE_ENV === 'test' || NODE_ENV === 'dev' ? DB_URL_TEST : DB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log('DB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
