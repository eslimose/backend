require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const financialDataRoutes = require('./routes/financialData');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // Ensure this line is correct
app.use('/api/financial-data', financialDataRoutes);
app.use('/api/admin', adminRoutes); // Add this line

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
