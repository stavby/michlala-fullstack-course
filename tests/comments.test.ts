import { expect } from '@jest/globals';
import httpStatus from 'http-status';
import request from 'supertest';
import { app } from '../index';
import { closeDB } from '../services/db';
import { Comment } from '../models/comments';

afterAll(() => {
	closeDB();
});

describe('Comments API', () => {
	let commentId: string;
	let postId: string;

	beforeAll(async () => {
		const response = await request(app).post('/posts').send({
			title: 'Test Post',
			sender: 'testuser',
			content: 'This is a test post for comments',
		});

		postId = response.body._id;
	});

	describe('Positive tests', () => {
		it('should create a new comment', async () => {
			const response = await request(app)
				.post('/comments')
				.send({
					sender: 'testuser',
					content: 'This is a test comment',
					postId,
				})
				.expect(httpStatus.CREATED);

			expect(response.body).toHaveProperty('_id');
			expect(response.body.sender).toBe('testuser');
			expect(response.body.content).toBe('This is a test comment');
			expect(response.body.postId).toBe(postId);

			commentId = response.body._id;
		});

		it('should get all comments', async () => {
			const response = await request(app).get('/comments').expect(httpStatus.OK);

			expect(Array.isArray(response.body)).toBe(true);
			expect(response.body.length).toBeGreaterThan(0);
			expect(response.body.find(({ _id, sender }: Comment) => _id === commentId && sender === 'testuser')).toBeDefined();
		});

		it('should get a comment by id', async () => {
			const response = await request(app).get(`/comments/${commentId}`).expect(httpStatus.OK);

			expect(response.body._id).toBe(commentId);
			expect(response.body.sender).toBe('testuser');
			expect(response.body.content).toBe('This is a test comment');
		});

		it('should update a comment by id', async () => {
			const response = await request(app)
				.put(`/comments/${commentId}`)
				.send({
					content: 'Updated comment content',
				})
				.expect(httpStatus.OK);

			expect(response.text).toBe(`Comment ${commentId} updated`);

			const updatedCommentResponse = await request(app).get(`/comments/${commentId}`).expect(httpStatus.OK);

			expect(updatedCommentResponse.body.content).toBe('Updated comment content');
		});

		it('should delete a comment by id', async () => {
			const response = await request(app).delete(`/comments/${commentId}`).expect(httpStatus.OK);

			expect(response.text).toBe(`comment ${commentId} deleted`);

			await request(app).get(`/comments/${commentId}`).expect(httpStatus.NOT_FOUND);
		});
	});

	describe('Negative tests', () => {
		it('should return 400 for invalid comment id', async () => {
			const invalidId = 'invalid-id';
			await request(app).get(`/comments/${invalidId}`).expect(httpStatus.BAD_REQUEST);
		});

		it('should return 404 for non-existing comment id', async () => {
			const nonExistingId = '6740bcfcaa86a22352cb55e2';
			await request(app).get(`/comments/${nonExistingId}`).expect(httpStatus.NOT_FOUND);
		});

		it('should return 400 for creating a comment with invalid post id', async () => {
			const response = await request(app)
				.post('/comments')
				.send({
					sender: 'testuser',
					content: 'This is a test comment',
					postId: 'invalid-post-id',
				})
				.expect(httpStatus.BAD_REQUEST);

			expect(response.text).toBe('Invalid post id "invalid-post-id"');
		});

		it('should return 400 for creating a comment with non-existing post id', async () => {
			const response = await request(app)
				.post('/comments')
				.send({
					sender: 'testuser',
					content: 'This is a test comment',
					postId: '6740bcfcaa86a22352cb55e3',
				})
				.expect(httpStatus.BAD_REQUEST);

			expect(response.text).toBe("Post with id 6740bcfcaa86a22352cb55e3 doesn't exist");
		});

		it('should return 400 for missing sender', async () => {
			await request(app)
				.post('/comments')
				.send({
					content: 'This is a test comment',
					postId,
				})
				.expect(httpStatus.BAD_REQUEST)
				.expect((response) => {
					expect(response.body).toHaveProperty('errors');
					expect(response.body.errors).toHaveProperty('sender');
					expect(response.body.errors.sender).toBe(`Path \`sender\` is required.`);
				});
		});

		it('should return 400 for missing content', async () => {
			await request(app)
				.post('/comments')
				.send({
					sender: 'testuser',
					postId,
				})
				.expect(httpStatus.BAD_REQUEST)
				.expect((response) => {
					expect(response.body).toHaveProperty('errors');
					expect(response.body.errors).toHaveProperty('content');
					expect(response.body.errors.content).toBe(`Path \`content\` is required.`);
				});
		});

		it('should return 400 for missing post id', async () => {
			await request(app)
				.post('/comments')
				.send({
					sender: 'testuser',
					content: 'This is a test comment',
				})
				.expect(httpStatus.BAD_REQUEST)
				.expect((response) => {
					expect(response.text).toBe('Invalid post id "(empty)"');
				});
		});
	});
});
