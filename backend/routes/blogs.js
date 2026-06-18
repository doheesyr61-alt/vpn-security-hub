const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Get all published blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true })
            .populate('author', 'name avatar')
            .sort({ publishedAt: -1 })
            .limit(10);
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single blog
router.get('/:slug', async (req, res) => {
    try {
        const blog = await Blog.findOne({ slug: req.params.slug })
            .populate('author', 'name avatar');
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        blog.views += 1;
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create blog (admin only)
router.post('/create', auth, admin, async (req, res) => {
    try {
        const { title, content, excerpt, thumbnail, category, tags } = req.body;
        const slug = title.toLowerCase().replace(/\s+/g, '-');

        const blog = new Blog({
            title,
            slug,
            content,
            excerpt,
            thumbnail,
            category,
            tags,
            author: req.user.userId,
            published: false
        });

        await blog.save();
        res.status(201).json({
            message: '✅ Blog created',
            blog
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Publish blog
router.post('/publish/:id', auth, admin, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { published: true, publishedAt: new Date() },
            { new: true }
        );
        res.json({
            message: '✅ Blog published',
            blog
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;