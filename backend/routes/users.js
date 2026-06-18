const express = require('express');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        const subscription = await Subscription.findOne({
            userId: req.user.userId,
            isActive: true
        });

        res.json({
            user,
            subscription
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile
router.put('/update', auth, async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, phone, avatar, updatedAt: Date.now() },
            { new: true }
        );
        res.json({ message: '✅ Profile updated', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user subscriptions
router.get('/subscriptions', auth, async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ userId: req.user.userId });
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;