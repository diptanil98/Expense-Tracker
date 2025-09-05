const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Food & Dining',
      'Transportation',
      'Entertainment',
      'Shopping',
      'Health & Fitness',
      'Bills & Utilities',
      'Travel',
      'Education',
      'Other'
    ],
    default: 'Other'
  },
  limit: {                // ✅ add limit field
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true, collection: 'budget' });

budgetSchema.pre('save', function (next) {
  this.date = Date.now();
  next();
});

module.exports = mongoose.model('Budget', budgetSchema);
