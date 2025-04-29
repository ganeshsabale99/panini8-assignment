import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
// console.log(process.env.MONGO_URI);
app.use(cors({
  origin:"*"
}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(()=>console.log('MongoDB connected'))
  .then(() => {
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch((err) => console.error(err));

// app.listen(process.env.PORT, async() => {
//   await connectDB();
//   console.log(`Server running on http://localhost:${process.env.PORT}`);
// })
