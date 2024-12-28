import { expect } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../index';
import httpStatus from 'http-status';

afterAll((done) => {
    server.close(done);
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
    });
});
