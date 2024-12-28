import { InferRawDocType, Schema, model } from 'mongoose';
import { TypeWithId } from '../utils/types';

const userSchemaDefinition = {
	username: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
} as const;

const userSchema = new Schema(userSchemaDefinition);

export const userModel = model('users', userSchema);

export type User = TypeWithId<InferRawDocType<typeof userSchemaDefinition>>;

export type UserDetails = Pick<User, 'password' | 'email'>;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user. Is unique.
 *         email:
 *           type: string
 *           description: The email of the user. Is unique.
 *       example:
 *         username: "shlomi"
 *         email: "shlomi@gmail.com"
 *     NewUser:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user. Is unique.
 *         email:
 *           type: string
 *           description: The email of the user. Is unique.
 *         password:
 *           type: string
 *           description: The password of the user.
 *       example:
 *         username: "shlomi"
 *         email: "shlomi@gmail.com"
 *         password: "shlomispassword123"
 */
