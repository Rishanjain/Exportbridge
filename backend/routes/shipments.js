const express = require('express');
const requireAuth = require('../middleware/auth');
const { shipments, providers } = require('../data/staticData');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  res.json({ shipments });
});

router.get('/providers', requireAuth, async (req, res) => {
  res.json({ providers });
});

router.post('/quote', requireAuth, async (req, res) => {
  const { providerName } = req.body || {};
  if (!providerName) return res.status(400).json({ error: 'providerName is required' });
  res.json({
    quote: {
      id: `QT-${Date.now()}`,
      providerName,
      currency: 'USD',
      amount: 1250,
      etaDays: 18,
    },
    message: 'Quote generated',
  });
});

module.exports = router;

