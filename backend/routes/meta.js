const express = require('express');
const requireAuth = require('../middleware/auth');
const { categories } = require('../data/staticData');

const router = express.Router();

router.get('/categories', requireAuth, async (req, res) => {
  res.json({ categories });
});

module.exports = router;

