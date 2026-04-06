const express = require('express');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const { buyers } = require('../data/staticData');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('connectedBuyerIds');
  const connectedBuyerIds = user?.connectedBuyerIds || [];
  res.json({ buyers, connectedBuyerIds });
});

router.post('/:id/connect', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ error: 'Invalid buyer id' });
  }

  const exists = buyers.some((b) => b.id === id);
  if (!exists) {
    return res.status(404).json({ error: 'Buyer not found' });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const set = new Set((user.connectedBuyerIds || []).map(Number));
  if (set.has(id)) set.delete(id);
  else set.add(id);
  user.connectedBuyerIds = Array.from(set);
  await user.save();

  res.json({ connectedBuyerIds: user.connectedBuyerIds });
});

module.exports = router;

