import express from 'express';
import { connectToDB } from './config/mongodb.js';
import dotenv from 'dotenv';
import bookRoutes from './routes/book.routes.js'
import auth from './routes/auth.route.js'
import user from './routes/user.route.js'
import { PORT } from './config/env.js';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false })); 
app.use(cookieParser()); 

app.use('/api/auth', auth)
app.use('/api/users', user)
app.use('/api/books', bookRoutes )

const startServer = async ()=>{
    try {
        await connectToDB();
        app.on("error", (error=>{
            console.log("Server error:", error);
        }))
        app.listen(PORT,()=>{
            console.log(`Server is running on port http://localhost:${PORT}`);
        })
    } catch (error) {
        error("Failed to start server:", error)
    }
}
startServer();