import mongoose from "mongoose";

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return true;
    }

    try {
        await mongoose.connect(process.env.TEST_MONGO_URI);
        console.log('Connecting to DB successfully');
        return true;
    } catch (error) {
        console.error(error)
    }
}

export default connectDB;