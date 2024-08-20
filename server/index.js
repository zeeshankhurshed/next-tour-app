import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import userRouter from './routes/user.js';
import tourRouter from './routes/tour.js';

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
const allowedOrigins = ['http://localhost:3000']; // Replace with your client URL
app.use(cors({
  origin: allowedOrigins, // Allow requests from this origin
  credentials: true, // Include credentials (cookies, etc.) in requests
}));

app.use('/user', userRouter);
app.use('/tour', tourRouter);


const PORT = 7500;
mongoose.connect('mongodb://localhost:27017/NTA')
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
