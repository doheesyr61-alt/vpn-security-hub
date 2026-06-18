const express = require('express');
const Server = require('../models/Server');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Get all servers
router.get('/', async (req, res) => {
    try {
        const servers = await Server.find({ isActive: true });
        res.json(servers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get server by country
router.get('/country/:country', async (req, res) => {
    try {
        const servers = await Server.find({
            country: req.params.country,
            isActive: true
        });
        res.json(servers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add server (admin only)
router.post('/add', auth, admin, async (req, res) => {
    try {
        const { name, country, ip, port, protocol } = req.body;
        const server = new Server({
            name,
            country,
            ip,
            port,
            protocol
        });
        await server.save();
        res.status(201).json({
            message: '✅ Server added',
            server
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete server (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Server.findByIdAndDelete(req.params.id);
        res.json({ message: '✅ Server deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;