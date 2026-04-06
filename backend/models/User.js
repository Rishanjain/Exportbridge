const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  passwordHash: { type: String, required: true },
  company: { type: String, default: '' },
  connectedBuyerIds: { type: [Number], default: [] },
  guideStepStatus: { type: Map, of: String, default: {} },
  marketAlerts: {
    type: [
      {
        title: String,
        badge: String,
        summary: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
