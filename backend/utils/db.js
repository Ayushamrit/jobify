import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
    }
}
export default connectDB;