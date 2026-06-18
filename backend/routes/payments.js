const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Transaction = require('../models/Transaction');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent (Stripe)
router.post('/stripe/create-intent', auth, async (req, res) => {
    try {
        const { amount, planName } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'thb',
            metadata: {
                userId: req.user.userId,
                planName
            }
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
    try {
        const { transactionId, paymentMethod, amount, planName } = req.body;

        const transaction = new Transaction({
            userId: req.user.userId,
            amount,
            paymentMethod,
            status: 'completed',
            transactionId
        });

        await transaction.save();

        // Create subscription
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        const PLAN_CONFIG = {
            'Basic': { maxDevices: 1, maxServers: 5, maxSpeed: 100 },
            'Pro': { maxDevices: 3, maxServers: 15, maxSpeed: 500 },
            'Premium': { maxDevices: 5, maxServers: 30, maxSpeed: 1000 }
        };

        const config = PLAN_CONFIG[planName];
        const subscription = new Subscription({
            userId: req.user.userId,
            planName,
            planPrice: amount,
            maxDevices: config.maxDevices,
            maxServers: config.maxServers,
            maxSpeed: config.maxSpeed,
            expiryDate,
            v2rayConfig: generateV2RayConfig()
        });

        await subscription.save();
        transaction.subscriptionId = subscription._id;
        await transaction.save();

        res.json({
            message: '✅ Payment successful',
            transaction,
            subscription
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.userId })
            .sort({ createdAt: -1 });
        res.json(transactions);
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