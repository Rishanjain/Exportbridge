const express = require('express');
const requireAuth = require('../middleware/auth');
const { demandTrends, exportPerformance } = require('../data/staticData');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  res.json({
    demandTrends,
    exportPerformance,
  });
});

module.exports = router;

