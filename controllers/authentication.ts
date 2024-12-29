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

			response
				.status(httpStatus.BAD_REQUEST)
				.json({
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

export const login = async (request: Request<{}, {}, { username: string; password: string }, {}>, response: Response) => {
	const { username, password } = request.body;
	const user = await userModel.findOne({ username }).select('-password');

	if (!user || !(await bcrypt.compare(password, user.password))) {
		response.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
		return;
	}

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || '', { expiresIn: process.env.JWT_EXPIRATION_TIME });
	response.json({ token, user });
};

export const logout = (_request: Request, response: Response) => {
	response.json({ message: 'Logged out successfully' });
};
