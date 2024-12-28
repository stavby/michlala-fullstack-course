import express from 'express';
import { createPost, getAllPosts, getPostById, updatePostById } from '../controllers/posts';
import { createErrorHandler } from '../utils/createErrorHandler';

export const postsRouter = express.Router();

postsRouter.post('/', createPost);
postsRouter.get('/', getAllPosts);
postsRouter.get('/:id', getPostById);
postsRouter.put('/:id', updatePostById);
postsRouter.use(createErrorHandler('posts'));
