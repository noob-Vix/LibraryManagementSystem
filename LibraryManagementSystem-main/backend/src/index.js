const express = require('express');
const { connectToDB } = require('./config/mongodb');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/book.routes');
const auth = require('./routes/auth.route');
const { PORT } = require('./config/env');
const cookieParser = require('cookie-parser');
const borrowRoutes = require('./routes/borrow.routes');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/auth', auth);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);

// Start server
const startServer = async () => {
    try {
        await connectToDB();
        app.on('error', (error) => {
            console.log('Server error:', error);
        });
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log('Failed to start server:', error);
    }
};

startServer();
