const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Load env vars
require('dotenv').config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const userRoutes = require('./routes/authRoutes');
app.use('/User', userRoutes);
app.use('/expenses', require('./routes/expenseRoutes'));
app.use('/budget',require('./routes/budgetRoutes'))
// Basic route for testing
app.get('/', (req, res) => {
  res.send('Expense Tracker API Running');
});

const PORT = process.env.PORT || 8765;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});