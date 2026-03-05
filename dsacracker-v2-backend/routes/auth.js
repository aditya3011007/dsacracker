const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dsa_cracker_super_secret_key_2026';

// Register User
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check existing
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash
        const passwordHash = await bcrypt.hash(password, 10);

        // Create
        const user = await prisma.user.create({
            data: { email, passwordHash, progressData: null }
        });

        // Generate Token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

        return res.status(201).json({
            token,
            user: { id: user.id, email: user.email, lcUsername: user.lcUsername }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });

        return res.json({
            token,
            user: { id: user.id, email: user.email, lcUsername: user.lcUsername }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

module.exports = router;
