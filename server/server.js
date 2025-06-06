import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoute from './routes/userRoute.js';

// Get the directory name from the URL (for ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/summerbuild2025';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI, {
  // Remove auth options and simplify for local development
})
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Please check your MongoDB is running and network connection.');
  });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});