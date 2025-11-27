import { body } from 'express-validator';

export const createTaskValidator = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
    body('endDate')
        .notEmpty()
        .withMessage('End date is required')
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value) => {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date format');
            }
            return true;
        }),
];

export const updateTaskValidator = [
    body('title')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Title cannot be empty')
        .isLength({ min: 1, max: 200 })
        .withMessage('Title must be between 1 and 200 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Priority must be LOW, MEDIUM, or HIGH'),
    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value) => {
            if (value) {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    throw new Error('Invalid date format');
                }
            }
            return true;
        }),
];
