const express = require('express');
const requireAuth = require('../middleware/auth');
const { fundingOptions } = require('../data/staticData');

const router = express.Router();

router.get('/options', requireAuth, async (req, res) => {
  res.json({ fundingOptions });
});

router.post('/apply', requireAuth, async (req, res) => {
  const { optionId } = req.body || {};
  const id = Number(optionId);
  const option = fundingOptions.find((o) => o.id === id);
  if (!option) {
    return res.status(400).json({ error: 'Invalid funding option' });
  }

  // Demo/stub: in a real app this would create an application record.
  res.json({
    application: {
      id: `APP-${Date.now()}`,
      optionId: option.id,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    },
    message: 'Application submitted',
  });
});

module.exports = router;

