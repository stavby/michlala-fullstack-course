import express from 'express';
import { createComment, getComments, getCommentById, updateCommentById, deleteCommentById } from '../controllers/comments';
import { createErrorHandler } from '../utils/createErrorHandler';

export const commentsRouter = express.Router();

commentsRouter.post('/', createComment);
commentsRouter.get('/', getComments);
commentsRouter.get('/:id', getCommentById);
commentsRouter.put('/:id', updateCommentById);
commentsRouter.delete('/:id', deleteCommentById);
commentsRouter.use(createErrorHandler('comments'));