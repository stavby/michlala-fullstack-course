import { InferRawDocType, Schema, model } from 'mongoose';
import { TypeWithId } from '../utils/types';

const userSchemaDefinition = {
	username: {
		type: String,
		required: true,
		unique: true,
		allowFilter: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		allowFilter: true,
	},
	password: {
		type: String,
		required: true,
		allowFilter: false,
	},
	refreshTokens: {
		type: [String],
		default: [],
		allowFilter: false,
	},
} as const;

const userSchema = new Schema(userSchemaDefinition);

export const userAllowedFilters = Object.entries(userSchemaDefinition)
	.filter(([, value]) => value.allowFilter)
	.map(([key]) => key);

export const userModel = model('users', userSchema);

export type User = TypeWithId<InferRawDocType<typeof userSchemaDefinition>>;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
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
 *         refreshTokens:
 *           type: array
 *           items:
 *             type: string
 *           description: The refresh tokens of the user.
 *       example:
 *         username: "shlomi"
 *         email: "shlomi@gmail.com"
 *         password: "105de2865bb931f9fc19fcc90e0f6457edab462c40b8cc1c2506f0781ec5345c"
 *         refreshTokens: []
 */
