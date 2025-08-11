const Expense= require('../models/expense');

exports.getExpense = async(req,res)=>{
    try{
        const expenses = await Expense.find({user:req.user.id}).sort('-date');
        res.json(expenses);
    }catch(err){
        console.error('Error fetching expenses:', err.message);
        res.status(500).send('Server error');
    }
}

exports.addExpense= async(req,res)=>{
    const { amount, merchant, location, category, paymentMethod, description } = req.body;
    try{
        const newExpense =new Expense({
            user:req.user.id,
            amount,
            merchant,
            location,
            category,
            paymentMethod,
            description
        });
        const expense = await newExpense.save();
        res.json(expense);
    }catch(err){
        console.error('Error adding expense:', err.message);
        res.status(500).send('Server error');
    }
}

exports.updateExpense = async (req, res) => {
  const { amount, merchant, location, category, paymentMethod, description } = req.body;

  // Build expense object
  const expenseFields = {
    amount,
    merchant,
    location,
    category,
    paymentMethod,
    description
  };

  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { $set: expenseFields },
      { new: true }
    );

    res.json(expense);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) return res.status(404).json({ msg: 'Expense not found' });

    // Make sure user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Expense.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Expense removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};