import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	sender: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	}
});

export const commentModel = mongoose.model('comments', commentSchema);