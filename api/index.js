import express from 'express';
import mongoose from 'mongoose';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
const app = express();

app.use(express.json());
app.use('/api/role', roleRoute)
app.use('/api/auth', authRoute)

//Свързване с база данни!
const connectMongoDb = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/authDb');
        console.log('Успешно свързване с базата данни!')
    } catch (error) {
        throw error;
    }
}

app.listen(8800, () => {
    connectMongoDb();
    console.log('Успешно свързване с backend-а!');
    
});