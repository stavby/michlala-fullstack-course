import { expect } from '@jest/globals';
import httpStatus from 'http-status';
import request from 'supertest';
import { app } from '../index';
import { Post } from '../models/posts';
import { closeDB } from '../services/db';

afterAll(() => {
	closeDB();
});

describe('Posts API', () => {
	describe('Positive tests', () => {
		let postId: string;

		it('should create a new post', async () => {
			const response = await request(app)
				.post('/posts')
				.send({
					title: 'Test Post',
					sender: 'testuser',
					content: 'This is a test post',
				})
				.expect(httpStatus.CREATED);

			expect(response.body).toHaveProperty('_id');
			expect(response.body.title).toBe('Test Post');
			expect(response.body.sender).toBe('testuser');
			expect(response.body.content).toBe('This is a test post');

			postId = response.body._id;
		});

		it('should get all posts', async () => {
			const response = await request(app).get('/posts').expect(httpStatus.OK);

			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.length).toBeGreaterThan(0);
			expect(response.body.find(({ _id, sender }: Post) => _id === postId && sender === 'testuser')).toBeDefined();
		});

		it('should get a post by id', async () => {
			const response = await request(app).get(`/posts/${postId}`).expect(httpStatus.OK);

			expect(response.body).toHaveProperty('_id', postId);
			expect(response.body.title).toBe('Test Post');
			expect(response.body.sender).toBe('testuser');
			expect(response.body.content).toBe('This is a test post');
		});

		it('should update a post by id', async () => {
			const response = await request(app)
				.put(`/posts/${postId}`)
				.send({
					content: 'Updated content',
				})
				.expect(httpStatus.OK);

			expect(response.text).toBe('Updated successfully');

			const updatedPostResponse = await request(app).get(`/posts/${postId}`).expect(httpStatus.OK);

			expect(updatedPostResponse.body.content).toBe('Updated content');
		});
	});

	describe('Negative tests', () => {
		it('should return 404 for non-existing post id', async () => {
			const nonExistingId = '6740aa79f7d3b27e1b049771';
			await request(app).get(`/posts/${nonExistingId}`).expect(httpStatus.NOT_FOUND);
		});

		it('should return 400 for invalid post id', async () => {
			const invalidId = 'invalid-id';
			await request(app).get(`/posts/${invalidId}`).expect(httpStatus.BAD_REQUEST);
		});

		it('should return 400 for missing title', async () => {
			await request(app)
				.post('/posts')
				.send({
					sender: 'testuser',
					content: `This post doesn't have a title :O`,
				})
				.expect(httpStatus.BAD_REQUEST)
				.expect((response) => {
					expect(response.body).toHaveProperty('errors');
					expect(response.body.errors).toHaveProperty('title');
					expect(response.body.errors.title).toBe(`Path \`title\` is required.`);
				});
		});

		it('should return 400 for missing sender', async () => {
			await request(app)
				.post('/posts')
				.send({
					title: 'Test Post',
					content: 'This post is missing a sender :(',
				})
				.expect(httpStatus.BAD_REQUEST)
				.expect((response) => {
					expect(response.body).toHaveProperty('errors');
					expect(response.body.errors).toHaveProperty('sender');
					expect(response.body.errors.sender).toBe(`Path \`sender\` is required.`);
				});
		});
	});
});
