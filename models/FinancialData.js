const mongoose = require('mongoose');

const FinancialDataSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['expense', 'income'], required: true },
  budget: { type: Number },
  debt: { type: Number },
});

module.exports = mongoose.model('FinancialData', FinancialDataSchema);
