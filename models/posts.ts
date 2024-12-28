import { InferRawDocType, Schema, model } from 'mongoose';
import { TypeWithId } from '../utils/types';

const postSchemaDefinition = {
	title: {
		type: String,
		required: true,
	},
	content: String,
	sender: {
		type: String,
		required: true,
	},
} as const;

const postSchema = new Schema(postSchemaDefinition);

export const postModel = model('posts', postSchema);

export type Post = TypeWithId<InferRawDocType<typeof postSchemaDefinition>>;
