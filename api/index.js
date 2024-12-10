import express from 'express';
import mongoose from 'mongoose';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
const app = express();

app.use(express.json());
app.use('/api/role', roleRoute);
app.use('/api/auth', authRoute);

//Мидълуер за управление на отговора
app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || "Нещо се обърка!";
    return res.status(statusCode).json({
        success: [200, 201, 204].includes(statusCode),
        status: statusCode,
        message: message,
        data: err.data || null,
    });
});

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