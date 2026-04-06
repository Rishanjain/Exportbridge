const express = require('express');
const Product = require('../models/Product');
const requireAuth = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { name, category, price, desc } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Product name and category are required' });
  }

  const product = await Product.create({
    name,
    category,
    price: Number(price || 0),
    desc: desc || '',
    owner: req.user.id,
  });

  const analysis = generateAnalysis(product);

  res.json({
    product,
    analysis,
    message: 'Product analyzed and saved successfully',
  });
});

router.get('/', requireAuth, async (req, res) => {
  const products = await Product.find({ owner: req.user.id }).sort({ createdAt: -1 });
  res.json({ products });
});

function generateAnalysis(product) {
  const categoryBoost = {
    'Pharmaceuticals & APIs': 15,
    'Handicrafts': 12,
    'Textiles': 10,
    'Organic Foods': 14,
    'Spices': 13,
    'Ayurvedic Products': 13,
  };

  const score = Math.min(
    100,
    65 + (categoryBoost[product.category] || 8) + (product.price > 1000 ? 5 : 0)
  );

  return {
    score,
    insights: `Your product ${product.name} is positioned well for global demand in ${product.category}.`,
    breakdown: {
      quality: 80,
      marketFit: 75,
      complianceReady: 68,
    },
    recommendations: [
      {
        id: 'rec-1',
        country: 'United States',
        category: product.category,
        demandLevel: 'High',
        marketSize: '580M',
        score: Math.min(100, score + 4),
        reason: 'Strong import demand for premium-grade goods and reliable supply chains.',
      },
      {
        id: 'rec-2',
        country: 'United Kingdom',
        category: product.category,
        demandLevel: 'Medium',
        marketSize: '120M',
        score: Math.max(60, score - 4),
        reason: 'Growing interest in sustainable supply with strong buyer networks.',
      },
      {
        id: 'rec-3',
        country: 'UAE',
        category: product.category,
        demandLevel: 'High',
        marketSize: '90M',
        score: Math.min(100, score + 2),
        reason: 'Rapid logistics adoption and high demand from trade corridors.',
      },
    ],
  };
}

module.exports = router;
