import mongoose from 'mongoose';

const dbUrl = `mongodb://${process.env.MONGODB_DATABASE_NAME}:${process.env.MONGODB_PASSWORD}@localhost:6000/${process.env.MONGODB_DATABASE_NAME}?authSource=admin`;

const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('Database connected...');
        console.log(dbUrl);
    } catch (error) {
        console.log(error.message);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
