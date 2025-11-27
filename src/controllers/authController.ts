import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import authService from '../services/authService';

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { name, email, password } = req.body;

        const user = await authService.register({ name, email, password });

        res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } catch (error: any) {
        console.error('Registration error:', error);

        if (error.message === 'User with this email already exists') {
            res.status(400).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password } = req.body;

        const { token, user } = await authService.login({ email, password });


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            message: 'Login successful',
            user,
        });
    } catch (error: any) {
        console.error('Login error:', error);

        if (error.message === 'Invalid email or password') {
            res.status(401).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Logout user
 */
export const logout = async (res: Response): Promise<void> => {
    try {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Get current user
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await authService.getUserById(req.userId as string);

        res.json({ user });
    } catch (error: any) {
        console.error('Get current user error:', error);

        if (error.message === 'User not found') {
            res.status(404).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal server error' });
    }
};
