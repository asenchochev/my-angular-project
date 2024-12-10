import express from 'express';
import { createRole, deleteRole, getAllRoles, updateRole } from '../controllers/roleController.js';
const router = express.Router();

//Създаване на нова роля в ДБ
router.post('/create', createRole);

//Актуализирана роля в ДБ
router.put('/update/:id', updateRole);

//Получаване на всички роли
router.get('/getAll', getAllRoles)

//Изтриване на роля
router.delete('/deleteRole/:id', deleteRole);

export default router;