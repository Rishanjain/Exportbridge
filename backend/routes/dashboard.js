const express = require('express');
const requireAuth = require('../middleware/auth');
const { statsData, recentActivity, marketInsights } = require('../data/staticData');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  res.json({
    statsData,
    recentActivity,
    marketInsights,
  });
});

module.exports = router;

