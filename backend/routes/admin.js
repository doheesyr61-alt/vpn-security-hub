const express = require('express');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

const router = express.Router();

// Get dashboard stats
router.get('/stats', auth, adminMiddleware, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalSubscriptions = await Subscription.countDocuments({ isActive: true });
        const totalRevenue = await Transaction.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const monthlyRevenue = await Transaction.aggregate([
            { $match: { status: 'completed', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            totalUsers,
            totalSubscriptions,
            totalRevenue: totalRevenue[0]?.total || 0,
            monthlyRevenue: monthlyRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
router.get('/users', auth, adminMiddleware, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all transactions
router.get('/transactions', auth, adminMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find().populate('userId', 'name email');
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Suspend user
router.post('/suspend/:userId', auth, adminMiddleware, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.userId, { isActive: false });
        res.json({ message: '✅ User suspended' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;