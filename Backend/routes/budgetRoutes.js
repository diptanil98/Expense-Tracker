const express=require("express")
const router=express.Router()
const Budget=require('../models/budget')

router.post('/Budget',async(req,res)=>{
    try{
        console.log('Budget creation request body:', req.body);
        if(!req.body.user){
            return res.status(400).send({error:"User ID is required"})
        }
        const budget=new Budget(req.body)
        await budget.save()
        res.status(201).send(budget);
    }catch(err){
        console.error('Error creating budget:', err);
        res.status(400).send({ error: err.message });
    }
})

router.get('/Budgets',async(req,res)=>{
    try{
        const budget=await Budget.find()
        res.status(200).send(budget)
    }catch(err){
        console.error('Error fetching budget:', err);
        res.status(500).send({ error: err.message });
    }
})

router.get('/user/:userId', async (req, res) => {
    try{
        const budget = await Budget.find({ user: req.params.userId });
        res.status(200).send(budget);
    }catch(err){
        console.error('Error fetching user budget:', err);
        res.status(500).send({ error: err.message });
    }
})

router.get('/:id', async (req, res) => {
    try{
        const budget= await Budget.findById(req.params.id);
        if(!budget){
            return res.status(404).send({ error: 'Budget not found' });
        }
        res.status(200).send(budget);
    }catch(err){
        console.error('Error fetching budget:', err);
        res.status(500).send({ error: err.message });
    }
})

router.delete('/:id', async (req, res) => {
    try{
        const budget = await Budget.findByIdAndDelete(req.params.id)
        if(!budget){
            return res.status(404).send({ error: 'Budget not found' })
        }
        res.status(200).send(budget)
    }catch(err){
        console.error('Error deleting budget:', err);
        res.status(500).send({ error: err.message });
    }
})

module.exports = router;