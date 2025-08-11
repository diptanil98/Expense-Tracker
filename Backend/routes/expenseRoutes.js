const express = require('express');
const router = express.Router();
const {check}= require('express-validator');
const auth = require('../middleware/auth');

const{
    getExpense,
    addExpense,
    updateExpense,
    deleteExpense
} = require('../controllers/expenseControllers');

router.get('/',auth,getExpense);
router.post('/',auth,[
    check('amount','Amount is required').not().isEmpty(),
    check('merchant','Merchant is required').not().isEmpty(),
    check('location','Location is required').not().isEmpty(),
    check('category','Category is required').not().isEmpty(),
    check('paymentMethod','Payment method is required').not().isEmpty(),
    check('description','Description is required').not().isEmpty()
],addExpense);

router.put('/:id',auth,updateExpense);

router.delete('/:id',auth,deleteExpense);

module.exports = router;
