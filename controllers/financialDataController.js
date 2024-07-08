// controllers/financialDataController.js
const FinancialData = require('../models/FinancialData');

const getFinancialData = async (req, res) => {
  try {
    const data = await FinancialData.find({ user: req.user.id });
    res.json(data);
  } catch (error) {
    console.error('Error fetching financial data:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const addFinancialData = async (req, res) => {
  const { category, amount, date, type, budget, debt } = req.body;

  try {
    const newFinancialData = new FinancialData({
      user: req.user.id,
      category,
      amount,
      date,
      type,
      budget,
      debt,
    });

    await newFinancialData.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving financial data:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = { getFinancialData, addFinancialData };
