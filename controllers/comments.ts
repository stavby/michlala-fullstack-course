import { NextFunction, Request, Response } from 'express';
import { commentModel } from '../models/comments';
import httpStatus from 'http-status';

export const createComment = async (request: Request, response: Response, next: NextFunction) => {
	const data = request.body;

	try {
		const newComment = await commentModel.create(data);
		response.status(httpStatus.CREATED).send(newComment);
	} catch (error) {
		next(error);
	}
};

export const getCommentById = async (request: Request, response: Response, next: NextFunction) => {
	const commentId = request.params.id;

	try {
		const comment = await commentModel.findOne({ _id: commentId });
		response.status(httpStatus.OK).send(comment);
	} catch (error) {
		next(error);
	}
};

export const updateCommentById = async (request: Request, response: Response, next: NextFunction) => {
	const commentId = request.params.id
	const data = request.body;

	try {
		await commentModel.updateOne({ _id: commentId }, data);
		response.status(httpStatus.OK).send(`comment ${commentId} updated`);
	} catch (error) {
		next(error);
	}
};


export const deleteCommentById = async (request: Request, response: Response, next: NextFunction) => {
	const commentId = request.params.id;

	try {
		await commentModel.deleteOne({ _id: commentId });
		response.status(httpStatus.OK).send(`comment ${commentId} deleted`);
	} catch (error) {
		next(error);
	}
};

export const errorHandler = (error: Error, request: Request, response: Response, _next: NextFunction) => {
	console.error(`An error occured in comments router at ${request.method} ${request.url} - ${error.message}`)
	response.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
};
