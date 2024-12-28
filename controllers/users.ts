import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { isValidObjectId } from 'mongoose';
import { userModel } from '../models/users';

export const getUsers = async (
	request: Request<{}, {}, {}, { userId?: string; username?: string; email?: string; password: never }>,
	response: Response,
	next: NextFunction
) => {
	const { userId } = request.query;

	if (!!userId && !isValidObjectId(userId)) {
		response.status(httpStatus.BAD_REQUEST).send(`Invalid id ${userId}`);
		return;
	}

	const filters = Object.entries(request.query)
		.filter(([key, value]) => Object.keys(userModel.schema.obj).includes(key) && value !== undefined)
		.reduce((previous, [key, value]) => ({ ...previous, [key]: value }), {});

	if (Object.entries(filters).length === 0 && userId === undefined) {
		response.status(httpStatus.BAD_REQUEST).send('No valid filters provided (username, email, userId)');
		return;
	}

	try {
		const user = await userModel.findOne(filters).select('-password');
		response.status(httpStatus.OK).send(user);
	} catch (error) {
		next(error);
	}
};

export const updateUserById = async (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
	const { id: userId } = request.params;
	const data = request.body;

	if (!isValidObjectId(userId)) {
		response.status(httpStatus.BAD_REQUEST).send(`Invalid id ${userId}`);
		return;
	}

	try {
		const updatedUser = await userModel.findByIdAndUpdate({ _id: userId }, data).select('-password');

		if (!updatedUser) {
			response.status(httpStatus.NOT_FOUND).send(`User with id ${userId} not found`);
			return;
		}

		response.status(httpStatus.OK).send(`User ${userId} updated`);
	} catch (error) {
		next(error);
	}
};

export const deleteUserById = async (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
	const { id: userId } = request.params;

	try {
		const deletedUser = await userModel.findByIdAndDelete({ _id: userId }).select('-password');
		if (deletedUser === null) {
			response.status(httpStatus.NOT_FOUND).send(`User with id ${userId} not found`);
			return;
		}
		response.status(httpStatus.OK).send(`User ${userId} deleted`);
	} catch (error) {
		next(error);
	}
};
