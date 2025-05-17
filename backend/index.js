import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import connectDB from './src/db/index.js'
import authRoutes from './src/routes/auth.js'; 

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
