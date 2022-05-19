import express from 'express';
import cors from 'cors';
import integrationRouter from './routers/integration';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from './util/config';

const app = express();
dotenv.config()
app.use(express.json());
app.use(cors());

//Connect to mongodb
mongoose.connect(config.MONGODB_URI!)
.then(()=>{
    console.log('Connect to database successfully');
    console.log(`Database: ${config.MONGODB_URI}`);
})
.catch(err=>console.log(err))

// IF: Messages from the External System for the same order came in longer 1 day between each other
// or even never come. All these kind of orders will be deleted from database

setInterval(()=>{
    // Each 24 hours, call the function that remove orders that might not contructed from database
    
}, 86400000 /*(1 day)*/)

// Routes
app.use('/api/integration', integrationRouter);

export default app;

