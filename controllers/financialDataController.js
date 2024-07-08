// controllers/financialDataController.js

const FinancialData = require('../models/FinancialData');

// Get financial data for a user
exports.getFinancialData = async (req, res) => {
  try {
    const data = await FinancialData.find({ userId: req.user.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new financial data
exports.addFinancialData = async (req, res) => {
  const { category, amount } = req.body;
  try {
    const newData = new FinancialData({
      userId: req.user.id,
      category,
      amount
    });
    await newData.save();
    res.json(newData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
