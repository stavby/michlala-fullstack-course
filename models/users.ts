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
