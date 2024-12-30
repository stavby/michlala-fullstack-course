import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { AddUserIdToRequest, Token } from '../utils/types';
import { appConfig } from '../utils/appConfig';

export const authorize = (request: Request, response: Response, next: NextFunction) => {
	const {
		jwtOptions: { jwtSecret },
	} = appConfig;
	const token = (request.headers.authorization || (request.headers.Authorization as string))?.split(' ')[1];

	if (!token) {
		response.status(httpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
		return;
	}

	try {
		const { type, userId } = jwt.verify(token, jwtSecret || '') as Token;
		if (type !== 'access') {
			response.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
			return;
		}

		(request as AddUserIdToRequest<Request>).userId = userId;
		next();
	} catch (err) {
		response.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
	}
};