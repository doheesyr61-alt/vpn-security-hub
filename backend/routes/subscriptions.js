const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

const PLAN_CONFIG = {
    'Basic': { price: 40, maxDevices: 1, maxServers: 5, maxSpeed: 100 },
    'Pro': { price: 60, maxDevices: 3, maxServers: 15, maxSpeed: 500 },
    'Premium': { price: 100, maxDevices: 5, maxServers: 30, maxSpeed: 1000 }
};

// Create subscription
router.post('/create', auth, async (req, res) => {
    try {
        const { planName, durationMonths = 1 } = req.body;

        if (!PLAN_CONFIG[planName]) {
            return res.status(400).json({ error: 'Invalid plan' });
        }

        const config = PLAN_CONFIG[planName];
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

        const subscription = new Subscription({
            userId: req.user.userId,
            planName,
            planPrice: config.price,
            maxDevices: config.maxDevices,
            maxServers: config.maxServers,
            maxSpeed: config.maxSpeed,
            expiryDate,
            v2rayConfig: generateV2RayConfig()
        });

        await subscription.save();
        res.status(201).json({
            message: '✅ Subscription created',
            subscription
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get active subscription
router.get('/active', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            userId: req.user.userId,
            isActive: true,
            expiryDate: { $gt: new Date() }
        });
        res.json(subscription);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Renew subscription
router.post('/renew/:id', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (subscription.userId.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const newExpiryDate = new Date(subscription.expiryDate);
        newExpiryDate.setMonth(newExpiryDate.getMonth() + 1);

        subscription.expiryDate = newExpiryDate;
        await subscription.save();

        res.json({
            message: '✅ Subscription renewed',
            subscription
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function generateV2RayConfig() {
    return JSON.stringify({
        id: require('crypto').randomUUID(),
        alterId: 0,
        security: 'auto'
    });
}

module.exports = router;