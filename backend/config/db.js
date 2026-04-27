import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`Database connected successfully`);
    } catch (error) {
        console.error("MongoDB Connection Error Details:");
        console.error(error.message);
        
        if (process.env.MONGO_URI.includes("127.0.0.1") || process.env.MONGO_URI.includes("localhost")) {
            console.error("\nTIP: Local MongoDB Connection Failed:");
            console.error("1. Make sure MongoDB Service is running (run 'services.msc' or 'mongod').");
            console.error("2. Check if your connection string uses 'localhost' or '127.0.0.1'.");
        } else if (error.code === 'ECONNREFUSED' || error.syscall === 'querySrv') {
            console.error("\nTIP: Atlas Connection Failed:");
            console.error("1. Whitelist your IP in MongoDB Atlas.");
            console.error("2. Check your network firewall/DNS settings.");
        }
    }
};
export default connectDB;
