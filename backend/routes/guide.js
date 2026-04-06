const express = require('express');
const requireAuth = require('../middleware/auth');
const User = require('../models/User');
const { exportGuideSteps } = require('../data/staticData');

const router = express.Router();

function mergedStepsForUser(user) {
  const statusMap = user?.guideStepStatus || new Map();
  return exportGuideSteps.map((s) => ({
    ...s,
    status: statusMap.get(String(s.id)) || s.status,
  }));
}

router.get('/steps', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('guideStepStatus');
  res.json({ steps: mergedStepsForUser(user) });
});

router.post('/steps/:id/status', requireAuth, async (req, res) => {
  const stepId = Number(req.params.id);
  const { status } = req.body || {};
  const allowed = new Set(['completed', 'in-progress', 'pending']);
  if (!Number.isFinite(stepId)) return res.status(400).json({ error: 'Invalid step id' });
  if (!allowed.has(status)) return res.status(400).json({ error: 'Invalid status' });

  const exists = exportGuideSteps.some((s) => s.id === stepId);
  if (!exists) return res.status(404).json({ error: 'Step not found' });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.guideStepStatus) user.guideStepStatus = new Map();
  user.guideStepStatus.set(String(stepId), status);
  await user.save();

  res.json({ steps: mergedStepsForUser(user) });
});

module.exports = router;

