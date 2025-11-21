import mongoose from 'mongoose';
import { MONGODB_URI } from './env.js';

export const connectToDB = async ()=>{
    try {
        await mongoose.connect(MONGODB_URI,console.log("Connecting to MongoDB"));
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Failed to connect to MongoDB",error);
        process.exit(1);
    }
}