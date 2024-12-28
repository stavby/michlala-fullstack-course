import express from 'express';
import { createUser, getUsers, updateUserById, deleteUserById } from '../controllers/users';
import { createErrorHandler } from '../utils/createErrorHandler';

export const usersRouter = express.Router();

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.put('/:id', updateUserById);
usersRouter.delete('/:id', deleteUserById);
usersRouter.use(createErrorHandler('users'));
