const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins for local dev
app.use(express.json({ limit: '50mb' })); // Increased limit for large progress JSON payload

// Routes
app.use('/auth', authRoutes);
app.use('/api', progressRoutes);
app.use('/api/ai', aiRoutes);

// Base route for health check
app.get('/', (req, res) => {
    res.json({ message: 'DSA Cracker V2 Backend API is running smoothly!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
