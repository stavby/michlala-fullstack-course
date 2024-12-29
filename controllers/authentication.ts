import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { userModel, User } from '../models/users';

const SALT_ROUNDS = 10;

export const register = async (request: Request<{}, {}, Omit<User, '_id'>, {}>, response: Response, next: NextFunction) => {
	const { username, email, password } = request.body;
	const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

	try {
		const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });

		if (existingUser) {
			const userDetailsConflict = {
				username: existingUser?.username === username,
				email: existingUser?.email === email,
			};

			response.status(httpStatus.BAD_REQUEST).json({
				message: 'User already exists with these details',
				conflictingDetails: userDetailsConflict,
			});
			return;
		}

		const creationResponse = await userModel.create({ username, email, password: hashedPassword });
		const { password, ...newUser } = creationResponse.toJSON();
		response.status(httpStatus.CREATED).send(newUser);
	} catch (error) {
		next(error);
	}
};

export const login = async (
	request: Request<{}, {}, Pick<User, 'username' | 'password'>, {}>,
	response: Response,
	next: NextFunction
) => {
	const { username, password } = request.body;
	try {
		const user = await userModel.findOne({ username });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			response.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
			return;
		}

		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: process.env.AUTH_TOKEN_EXPIRATION_TIME });
		const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', {
			expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
		});

		response.status(httpStatus.OK).json({ token, refreshToken });
	} catch (error) {
		next(error);
	}
};

export const refresh = async (request: Request<{}, {}, { refreshToken: string }, {}>, response: Response, next: NextFunction) => {
	const { refreshToken } = request.body;

	if (!refreshToken) {
		response.status(httpStatus.BAD_REQUEST).json({ message: 'No token provided' });
		return;
	}

	try {
		const { id: userId } = jwt.verify(refreshToken, process.env.JWT_SECRET || '') as { id: string };
		const newToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || '', {
			expiresIn: process.env.AUTH_TOKEN_EXPIRATION_TIME,
		});
		const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET || '', {
			expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME,
		});
		response.status(httpStatus.OK).json({ token: newToken, refreshToken: newRefreshToken });
	} catch (error) {
		response.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid token' });
	}
};

export const logout = (_request: Request, response: Response) => {
	response.json({ message: 'Logged out successfully' });
};
