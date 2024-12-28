import { InferRawDocType, Schema, model } from 'mongoose';
import { TypeWithId } from '../utils/types';

const commentSchemaDefinition = {
	sender: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	postId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
} as const;

const commentSchema = new Schema(commentSchemaDefinition);

export const commentModel = model('comments', commentSchema);

export type Comment = TypeWithId<InferRawDocType<typeof commentSchemaDefinition>>;
