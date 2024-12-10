import express from 'express';
import { login, register } from '../controllers/authController.js';

const router = express.Router();


//Регистрация
router.post('/register', register )

//Логин
router.post('/login', login);


export default router