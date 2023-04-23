const { mongoose } = require('mongoose');
const { genericLogger } = require('./logger');

// const dbUrl = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@localhost:6000/${process.env.MONGODB_DATABASE_NAME}?authSource=admin`;
const dbUrlProd = 'mongodb+srv://aioele:Andromeda50ioele@cluster-ai.xepqosm.mongodb.net/crud-api-db-prod?retryWrites=true&w=majority';
const connectDB = async () => {
  try {
    await mongoose.connect(dbUrlProd);
    console.log('Database connected...');
    console.log(dbUrlProd);
  } catch (error) {
    genericLogger.error(error);
    console.log(dbUrlProd);
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;
