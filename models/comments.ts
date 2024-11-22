import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
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
	}
});

export const commentModel = model('comments', commentSchema);