import express from 'express';
import { createPost, getAllPosts, getPostById, errorHandler, updatePostById } from '../controllers/posts';

export const postsRouter = express.Router();

postsRouter.post('/', createPost);
postsRouter.get('/', getAllPosts);
postsRouter.get('/:id', getPostById);
postsRouter.put('/:id', updatePostById);
postsRouter.use(errorHandler);
