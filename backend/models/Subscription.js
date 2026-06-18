const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planName: {
        type: String,
        enum: ['Basic', 'Pro', 'Premium'],
        required: true
    },
    planPrice: {
        type: Number,
        required: true
    },
    maxDevices: {
        type: Number,
        required: true
    },
    maxServers: {
        type: Number,
        required: true
    },
    maxSpeed: {
        type: Number, // in Mbps
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    autoRenew: {
        type: Boolean,
        default: true
    },
    v2rayConfig: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);