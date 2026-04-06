const express = require('express');
const requireAuth = require('../middleware/auth');
const { marketInsights, aiRecommendations } = require('../data/staticData');
const User = require('../models/User');

const router = express.Router();

router.get('/insights', requireAuth, async (req, res) => {
  res.json({
    marketInsights,
    aiRecommendations,
    alert: {
      title: 'Market Trend Alert',
      badge: 'New',
      summary:
        'UAE Spice Market is seeing a 34% surge in demand for South Asian spice imports. Post-CEPA agreement, tariff barriers have dropped significantly.',
    },
  });
});

router.post('/alerts', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const { title, badge, summary } = req.body || {};
  const alertPayload = {
    title: title || 'Market Trend Alert',
    badge: badge || 'New',
    summary: summary || 'Alert saved successfully',
    createdAt: new Date(),
  };

  user.marketAlerts = user.marketAlerts || [];
  user.marketAlerts.unshift(alertPayload);
  user.marketAlerts = user.marketAlerts.slice(0, 10); // keep recent only
  await user.save();

  res.json({ ok: true, alert: alertPayload });
});

module.exports = router;

