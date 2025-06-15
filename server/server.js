import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoute from './routes/userRoute.js';
import internshipRoute from './routes/internshipRoute.js';

// Get the directory name from the URL (for ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import userRoute from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://perr0003:5UMDFlaf5FkVQwCX@cluster0.0evl96w.mongodb.net/InternshipTracker?retryWrites=true&w=majority&appName=Cluster0';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
    // Log the database name to verify connection
    console.log(`📊 Database name: ${mongoose.connection.db.databaseName}`);
    
    // List collections to confirm access
    mongoose.connection.db.listCollections().toArray()
      .then(collections => {
        console.log('📚 Available collections:', collections.map(c => c.name).join(', '));
      });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
  });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
app.use('/api', internshipRoute);

