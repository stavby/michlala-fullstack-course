import express from 'express';
import { getUserByDetails, updateUserById, deleteUserById } from '../controllers/users';
import { createErrorHandler } from '../utils/createErrorHandler';

export const usersRouter = express.Router();

usersRouter.get('/', getUserByDetails);
usersRouter.put('/:id', updateUserById);
usersRouter.delete('/:id', deleteUserById);
usersRouter.use(createErrorHandler('users'));
