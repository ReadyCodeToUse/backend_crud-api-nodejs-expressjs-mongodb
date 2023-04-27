const { mongoose } = require('mongoose');
const { genericLogger } = require('./logger');

let dbUrl = '';
const { NODE_ENV } = process.env;
if (NODE_ENV != null) {
  switch (NODE_ENV) {
    case 'stage':
      dbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME_STAGE}:${process.env.MONGODB_PASSWORD_STAGE}@cluster-ai.xepqosm.mongodb.net/${process.env.MONGODB_DATABASE_NAME_STAGE}?retryWrites=true&w=majority`;
      break;
    case 'production':
      dbUrl = `mongodb+srv://${process.env.MONGODB_USERNAME_PROD}:${process.env.MONGODB_PASSWORD_PROD}@cluster-ai.xepqosm.mongodb.net/${process.env.MONGODB_DATABASE_NAME_PROD}?retryWrites=true&w=majority`;
      break;
    case 'local':
      dbUrl = `mongodb://${process.env.MONGODB_USERNAME_LOCAL}:${process.env.MONGODB_PASSWORD_LOCAL}@localhost:6000/${process.env.MONGODB_DATABASE_NAME_LOCAL}?authSource=admin`;
      break;
    default:
      dbUrl = `mongodb://${process.env.MONGODB_USERNAME_LOCAL}:${process.env.MONGODB_PASSWORD_LOCAL}@localhost:6000/${process.env.MONGODB_DATABASE_NAME_LOCAL}?authSource=admin`;
      process.env.NODE_ENV = 'local';
      break;
  }
}
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl);
    // eslint-disable-next-line no-console
    console.log(`Database connected. \nURL: ${dbUrl}\nENV: ${process.env.NODE_ENV}`);
  } catch (error) {
    genericLogger.error(error);
    // eslint-disable-next-line no-console
    console.log(dbUrl);
    // eslint-disable-next-line no-console
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
