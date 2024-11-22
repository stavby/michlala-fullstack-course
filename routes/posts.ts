import express from 'express';
import { createPost, getAllPosts, getPostById } from '../controllers/posts';

const router = express.Router();

router.get('/', getAllPosts);

router.get('/:id', getPostById);

router.post('/', createPost);
