const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dsa_cracker_super_secret_key_2026';

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized. No token.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized. Invalid or expired token.' });
    }
};

// GET Progress - Download cloud state to local
router.get('/progress', authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { progressData: true, lcUsername: true }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({
            progressData: user.progressData ? JSON.parse(user.progressData) : null,
            lcUsername: user.lcUsername
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

// POST Progress - Upload local state to cloud
router.post('/progress', authMiddleware, async (req, res) => {
    try {
        const { progressData, lcUsername } = req.body;

        await prisma.user.update({
            where: { id: req.userId },
            data: {
                progressData: JSON.stringify(progressData),
                lcUsername: lcUsername
            }
        });

        res.json({ message: 'Progress saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

module.exports = router;
