const express= require('express');
const router = express.Router();
const Expense = require('../models/expense');

router.post('/expenses',async(req, res) => {
    try{
        // Check if user is provided (required field)
        if (!req.body.user) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        
        const expense=new Expense(req.body);
        await expense.save();
        res.status(201).send(expense);
    }catch(err){
        console.error('Error creating expense:', err);
        res.status(400).send({ error: err.message });
    }
})

router.get('/expenses', async (req, res) => {
    try{
        const expenses= await Expense.find();
        res.status(200).send(expenses);
    }catch(err){
        console.error('Error fetching expenses:', err);
        res.status(500).send({ error: err.message });
    }
})

router.get('/expenses/:id', async (req, res) => {
    try{
        const expense= await Expense.findById(req.params.id);
        if(!expense){
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.status(200).send(expense);
    }catch(err){
        console.error('Error fetching expense:', err);
        res.status(500).send({ error: err.message });
    }
})

router.put('/expenses/:id',async(req,res)=>{
    try{
        const expense=await Expense.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true,
            overwrite:true
        });
        if(!expense){
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.status(200).send(expense);
    }catch(err){
        console.error('Error updating expense:', err);
        res.status(500).send({ error: err.message });
    }
});

router.delete('/expenses/:id', async (req, res) => {
    try{
        const expense = await Expense.findByIdAndDelete(req.params.id);
        if (!expense) {
            return res.status(404).send({ error: 'Expense not found' });
        }
        res.status(200).send(expense);
    }catch(err){
        console.error('Error deleting expense:', err);
        res.status(500).send({ error: err.message });
    }
});
module.exports = router;