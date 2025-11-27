import prisma from '../config/database';
import { Priority } from '@prisma/client';

interface CreateTaskData {
    userId: string;
    title: string;
    description?: string;
    priority: Priority;
    endDate: Date;
}

interface UpdateTaskData {
    title?: string;
    description?: string;
    priority?: Priority;
    endDate?: Date;
}

interface GetTasksParams {
    userId: string;
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    priority?: string;
}

export class TaskService {
    /**
     * Get all tasks for a user with pagination, sorting, and filtering
     */
    async getTasks(params: GetTasksParams) {
        const { userId, page, limit, sortBy, sortOrder, priority } = params;

        const skip = (page - 1) * limit;

        let orderBy: any = {};
        if (sortBy === 'endDate') {
            orderBy = { endDate: sortOrder };
        } else if (sortBy === 'priority') {
            orderBy = { priority: sortOrder };
        } else {
            orderBy = { createdAt: sortOrder };
        }

        const where: any = { userId };
        if (priority && priority !== 'ALL') {
            where.priority = priority;
        }


        const [tasks, totalCount] = await Promise.all([
            prisma.task.findMany({
                where,
                orderBy,
                skip,
                take: limit,
            }),
            prisma.task.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            tasks,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount,
                limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }

    /**
     * Create a new task
     */
    async createTask(data: CreateTaskData) {
        const { userId, title, description, priority, endDate } = data;

        const task = await prisma.task.create({
            data: {
                userId,
                title,
                description: description || null,
                priority: priority || 'MEDIUM' as Priority,
                endDate,
            },
        });

        return task;
    }

    /**
     * Get a task by ID
     */
    async getTaskById(taskId: string, userId: string) {
        const task = await prisma.task.findUnique({
            where: { id: taskId },
        });

        if (!task) {
            throw new Error('Task not found');
        }

        if (task.userId !== userId) {
            throw new Error('You do not have permission to access this task');
        }

        return task;
    }

    /**
     * Update a task
     */
    async updateTask(taskId: string, userId: string, data: UpdateTaskData) {
        await this.getTaskById(taskId, userId);


        const updatedTask = await prisma.task.update({
            where: { id: taskId },
            data: {
                ...(data.title && { title: data.title }),
                ...(data.description !== undefined && { description: data.description }),
                ...(data.priority && { priority: data.priority }),
                ...(data.endDate && { endDate: data.endDate }),
            },
        });

        return updatedTask;
    }

    /**
     * Delete a task
     */
    async deleteTask(taskId: string, userId: string) {
        await this.getTaskById(taskId, userId);


        await prisma.task.delete({
            where: { id: taskId },
        });

        return { message: 'Task deleted successfully' };
    }
}

export default new TaskService();
