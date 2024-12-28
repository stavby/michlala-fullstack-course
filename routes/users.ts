import express from 'express';
import { createUser, getUsers, errorHandler, updateUserById, deleteUserById } from '../controllers/users';

export const usersRouter = express.Router();

usersRouter.post('/', createUser);
usersRouter.get('/', getUsers);
usersRouter.put('/:id', updateUserById);
usersRouter.delete('/:id', deleteUserById);
usersRouter.use(errorHandler);
