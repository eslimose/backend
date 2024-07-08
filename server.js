require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const financialDataRoutes = require('./routes/financialData');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/financial-data', financialDataRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
