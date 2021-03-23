const mongoose = require('mongoose');
require('dotenv').config({ path: 'src/variables.env' });
const { DB_URL, DB_URL_TEST, NODE_ENV } = process.env;

const connectionString = NODE_ENV === 'test' ? DB_URL_TEST : DB_URL;
const topologyString = NODE_ENV !== 'test';
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: topologyString,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB connected');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
