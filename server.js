const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const routes = require('./routes'); // Only this route import is needed
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body parser
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Auth API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.use(mongoSanitize());
app.use(xss());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});