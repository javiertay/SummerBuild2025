import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoute from './routes/users.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoute);

app.get('/', (req, res) => {
    res.send('HustleHub API v1');
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});