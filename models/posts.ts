import { Schema, model } from 'mongoose';

const postSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	content: String,
	sender: {
		type: String,
		required: true,
	},
});

export const postModel = model('posts', postSchema);
