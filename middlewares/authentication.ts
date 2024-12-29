import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

export const authenticationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
        response.status(httpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
		return;
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || '');
        next();
    } catch (err) {
        response.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
    }
};