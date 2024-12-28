import { InferRawDocType, Schema, model } from 'mongoose';

const userSchemaDefinition = {
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
} as const;

const userSchema = new Schema(userSchemaDefinition);

export const userModel = model('users', userSchema);

export type User = InferRawDocType<typeof userSchemaDefinition>;
