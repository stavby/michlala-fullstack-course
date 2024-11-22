import { Request, Response, ErrorRequestHandler } from 'express';
import { postModel } from '../models/posts';
import httpStatus from 'http-status';

export const getAllPosts = async (req: Request<{}, {}, {}, { owner: string }>, res: Response) => {
    const { owner } = req.query;

    if (owner) {
        const posts = await postModel.find({ owner });
        res.send(posts);
    } else {
        const posts = await postModel.find();
        res.send(posts);
    }
};

export const getPostById = async (req: Request<{ id: string }>, res: Response) => {
    const { id: postId } = req.params;

    const post = await postModel.findById(postId);
    if (post) {
        res.send(post);
    } else {
        res.status(httpStatus.NOT_FOUND).send(`Post with id ${postId} not found`);
    }
};

export const createPost = async (req: Request, res: Response) => {
    const postBody = req.body;

    const post = await postModel.create(postBody);
    res.status(httpStatus.CREATED).send(post);
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.error(`An error occured in posts router at ${req.url}: `, (error as Error).message);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Internal server error');
};
