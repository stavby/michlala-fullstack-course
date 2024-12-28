import express from 'express';
import { register, login, logout } from '../controllers/authentication';
import { createErrorHandler } from '../utils/createErrorHandler';

export const authenticationRouter = express.Router();

authenticationRouter.post('/register', register);
authenticationRouter.post('/login', login);
authenticationRouter.post('/logout', logout);
authenticationRouter.use(createErrorHandler('authentication'));
