import { Router } from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from '../controllers/taskController';
import { createTaskValidator, updateTaskValidator } from '../validators/taskValidator';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All task routes are protected
router.use(authenticateToken);

router.get('/', getTasks);
router.post('/', createTaskValidator, createTask);
router.put('/:id', updateTaskValidator, updateTask);
router.delete('/:id', deleteTask);

export default router;
