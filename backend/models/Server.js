const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    protocol: {
        type: String,
        enum: ['VMess', 'VLESS', 'Shadowsocks', 'Trojan'],
        default: 'VMess'
    },
    maxUsers: {
        type: Number,
        default: 100
    },
    currentUsers: {
        type: Number,
        default: 0
    },
    speed: {
        type: Number, // in Mbps
        default: 1000
    },
    isActive: {
        type: Boolean,
        default: true
    },
    uptime: {
        type: Number, // percentage
        default: 99.9
    },
    lastChecked: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Server', serverSchema);