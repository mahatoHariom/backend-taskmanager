import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import taskService from '../services/taskService';

/**
 * Get all tasks for authenticated user with pagination and sorting
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortBy = (req.query.sortBy as string) || 'createdAt';
        const sortOrder = (req.query.sortOrder as string) || 'desc';
        const priority = req.query.priority as string;

        const result = await taskService.getTasks({
            userId,
            page,
            limit,
            sortBy,
            sortOrder,
            priority,
        });

        res.json(result);
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Create a new task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userId = req.userId as string;
        const { title, description, priority, endDate } = req.body;

        const task = await taskService.createTask({
            userId,
            title,
            description,
            priority,
            endDate: new Date(endDate),
        });

        res.status(201).json({
            message: 'Task created successfully',
            task,
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Update a task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const userId = req.userId as string;
        const { id } = req.params;
        const { title, description, priority, endDate } = req.body;

        const updatedTask = await taskService.updateTask(id, userId, {
            title,
            description,
            priority,
            endDate: endDate ? new Date(endDate) : undefined,
        });

        res.json({
            message: 'Task updated successfully',
            task: updatedTask,
        });
    } catch (error: any) {
        console.error('Update task error:', error);

        if (error.message === 'Task not found') {
            res.status(404).json({ error: error.message });
            return;
        }

        if (error.message === 'You do not have permission to access this task') {
            res.status(403).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId as string;
        const { id } = req.params;

        const result = await taskService.deleteTask(id, userId);

        res.json(result);
    } catch (error: any) {
        console.error('Delete task error:', error);

        if (error.message === 'Task not found') {
            res.status(404).json({ error: error.message });
            return;
        }

        if (error.message === 'You do not have permission to access this task') {
            res.status(403).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};
