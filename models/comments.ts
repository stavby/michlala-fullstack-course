import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
	owner: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	}
});

export const commentModel = mongoose.model('Comments', commentSchema);