require('dotenv').config();
const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
app.set('trust proxy', 1);

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://jobsmart-v4.vercel.app"
  ],
  credentials: true
}));
// app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Routes
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/cv',           require('./routes/cv'));
app.use('/api/jobs',         require('./routes/jobs'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/payments',     require('./routes/payments'));

app.get('/api/health', (req, res) => res.json({ status: 'OK', version: '3.0.0' }));

// MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jobsmart')
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ MongoDB:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
