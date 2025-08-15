const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  merchant: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Other'
    ],
    default: 'Other'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'],
    default: 'Credit Card'
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isFraud: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
ExpenseSchema.pre('save', function(next) {
  this.date = Date.now();
  next();
}, { collection: 'expenses' });

module.exports = mongoose.model('Expense', ExpenseSchema, 'expenses');