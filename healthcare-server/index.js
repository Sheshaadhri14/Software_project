import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { UserRouter } from './routes/user.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
  origin: 'http://localhost:5173', // Update with the frontend's URL in production
  credentials: true,
};
app.use(cors(corsOptions));
// CORS configuration


// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(helmet()); // Add security headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Connect to MongoDB
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/authentication';

mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Use the UserRouter for routes starting with /auth
app.use('/auth', UserRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
