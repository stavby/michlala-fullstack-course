import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
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

export const postModel = mongoose.model('posts', postSchema);
