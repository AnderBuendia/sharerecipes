import { connect, connection } from 'mongoose';
import { DB_URL, DB_URL_TEST, NODE_ENV } from '@Shared/utils/constants';

const ENVIRONMENT = {
  test: DB_URL_TEST,
  dev: DB_URL_TEST,
  production: DB_URL,
};

const connectionString = ENVIRONMENT[NODE_ENV];

export const initializeDB = async () => {
  try {
    const isConnected = await connect(connectionString);

    if (!isConnected) throw new Error('Failed to connect to DB');

    console.log('🚀 DB Connected');
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

export const stopDB = async () => {
  await connection.close();
};
