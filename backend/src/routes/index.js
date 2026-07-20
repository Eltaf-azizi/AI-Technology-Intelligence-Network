const express = require('express');

const router = express.Router();

const authRoutes = require('./authRoutes');
const newsRoutes = require('./newsRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const sentimentRoutes = require('./sentimentRoutes');
const trendRoutes = require('./trendRoutes');
const notificationRoutes = require('./notificationRoutes');
const userRoutes = require('./userRoutes');

router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/sentiment', sentimentRoutes);
router.use('/trends', trendRoutes);
router.use('/notifications', notificationRoutes);
router.use('/users', userRoutes);

module.exports = router;
