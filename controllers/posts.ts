import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { postModel } from '../models/posts';
import { isValidObjectId } from 'mongoose';

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const postBody = req.body;

        const post = await postModel.create(postBody);
        res.status(httpStatus.CREATED).send(post);
    } catch (error) {
        if ((error as Error).name === 'ValidationError') {
            const errors: { [field: string]: string } = {};

            Object.keys((error as any).errors).forEach((key) => {
                errors[key] = (error as any).errors[key].message;
            });

            res.status(400).send({ errors });
            return;
        }

        next(error);
    }
};

export const getAllPosts = async (req: Request<{}, {}, {}, { sender: string }>, res: Response, next: NextFunction) => {
    try {
        const { sender } = req.query;

        const posts = !!sender ? await postModel.find({ sender }) : await postModel.find();
        res.send(posts);
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id: postId } = req.params;

        if (!isValidObjectId(postId)) {
            res.status(httpStatus.BAD_REQUEST).send('Invalid id');
            return;
        }

        const post = await postModel.findById(postId);
        if (!post) {
            res.status(httpStatus.NOT_FOUND).send(`Post with id ${postId} not found`);
            return;
        }

        res.send(post);
    } catch (error) {
        next(error);
    }
};

export const updatePostById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const { id: postId } = req.params;

        if (!isValidObjectId(postId)) {
            res.status(httpStatus.BAD_REQUEST).send('Invalid id');
            return;
        }

        const updateResponse = await postModel.updateOne({ _id: postId }, req.body);
        if (updateResponse.matchedCount === 0) {
            res.status(httpStatus.NOT_FOUND).send(`Post with id ${postId} not found`);
            return;
        }

        res.status(httpStatus.OK).send('Updated successfully');
    } catch (error) {
        next(error);
    }
};

export const postsErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.error(`An error occured in posts router at ${req.method} ${req.url} - `, (error as Error).message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
};
