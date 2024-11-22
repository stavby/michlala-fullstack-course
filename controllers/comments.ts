import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { isValidObjectId } from 'mongoose';
import { commentModel } from '../models/comments';
import { formatValidationError } from '../utils/formatValidationError';

export const createComment = async (request: Request, response: Response, next: NextFunction) => {
	const data = request.body;

	try {
		const newComment = await commentModel.create(data);
		response.status(httpStatus.CREATED).send(newComment);
	} catch (error) {
		next(error);
	}
};

export const getComments = async (request: Request<{}, {}, {}, { sender?: string }>, response: Response, next: NextFunction) => {
	const { sender } = request.query;

	try {
		const comments = await commentModel.find(!!sender ? { sender } : {});
		response.status(httpStatus.OK).send(comments);
	} catch (error) {
		next(error);
	}
};

export const getCommentById = async (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
	const { id: commentId } = request.params;

	if (!isValidObjectId(commentId)) {
		response.status(httpStatus.BAD_REQUEST).send(`Invalid id ${commentId}`);
		return;
	}

	try {
		const comment = await commentModel.findById(commentId);

		if (!comment) {
			response.status(httpStatus.NOT_FOUND).send(`comment ${commentId} not found`);
			return;
		}

		response.status(httpStatus.OK).send(comment);
	} catch (error) {
		next(error);
	}
};

export const updateCommentById = async (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
	const { id: commentId } = request.params
	const data = request.body;

	if (!isValidObjectId(commentId)) {
		response.status(httpStatus.BAD_REQUEST).send(`Invalid id ${commentId}`);
		return;
	}

	try {
		const updateResponse = await commentModel.updateOne({ _id: commentId }, data);

		if (updateResponse.matchedCount === 0) {
			response.status(httpStatus.NOT_FOUND).send(`Comment with id ${commentId} not found`);
			return;
		}

		response.status(httpStatus.OK).send(`Comment ${commentId} updated`);
	} catch (error) {
		next(error);
	}
};


export const deleteCommentById = async (request: Request<{ id: string }>, response: Response, next: NextFunction) => {
	const { id: commentId } = request.params;

	try {
		await commentModel.deleteOne({ _id: commentId });
		response.status(httpStatus.OK).send(`comment ${commentId} deleted`);
	} catch (error) {
		next(error);
	}
};

export const errorHandler: ErrorRequestHandler = (error: Error, request: Request, response: Response, _next: NextFunction) => {
	console.error(`An error occured in comments router at ${request.method} ${request.url} - ${error.message}`)

	if (error.name === 'ValidationError') {
		response.status(httpStatus.BAD_REQUEST).send(formatValidationError(error));
	} else {
		response.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
	}
};