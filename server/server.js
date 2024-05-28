import express from 'express';
import connectDB from './db/connect.js';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.PORT);

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
connectDB();

const PORT = process.env.PORT || 5000;
// const MONGODB_URI = process.env.MONGODB_URI;

app.use('/api/users', userRoutes);

app.get('/',(req,res)=>{
    res.send("Server is ready!");
});

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});