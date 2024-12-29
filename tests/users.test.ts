import { expect } from '@jest/globals';
import httpStatus from 'http-status';
import request from 'supertest';
import { app } from '../index';

import { closeDB } from '../services/db';

afterAll(() => {
	closeDB();
});

describe('Users API', () => {
	describe('Positive tests', () => {
		let userId: string; // Need to take care of this after adding registartion route

		beforeAll(async () => {
			const response = await request(app).post('/auth/register').send({
				username: 'testuser',
				email: 'testuser@example.com',
				password: 'password',
			});
	
			userId = response.body._id;
		});

		it('should get a user by details', async () => {
			const response = await request(app).get('/users').query({ username: 'testuser' }).expect(httpStatus.OK);

			expect(response.body._id).toBe(userId);
			expect(response.body.username).toBe('testuser');
			expect(response.body.email).toBe('testuser@example.com');
		});

		it('should get a user by id', async () => {
			const response = await request(app).get(`/users/${userId}`).expect(httpStatus.OK);

			expect(response.body).toHaveProperty('_id', userId);
			expect(response.body.username).toBe('testuser');
			expect(response.body.email).toBe('testuser@example.com');
		});

		it('should update a user by id', async () => {
			const response = await request(app)
				.put(`/users/${userId}`)
				.send({
					email: 'updateduser@example.com',
				})
				.expect(httpStatus.OK);

			expect(response.text).toBe(`User ${userId} updated`);

			const updatedUserResponse = await request(app).get(`/users/${userId}`).expect(httpStatus.OK);

			expect(updatedUserResponse.body.email).toBe('updateduser@example.com');
		});

		it('should delete a user by id', async () => {
			const response = await request(app).delete(`/users/${userId}`).expect(httpStatus.OK);

			expect(response.text).toBe(`User ${userId} deleted`);

			await request(app).get(`/users/${userId}`).expect(httpStatus.NOT_FOUND);
		});
	});

	describe('Negative tests', () => {
		it('should return 404 for getting non-existing user id', async () => {
			const nonExistingId = '6740aa79f7d3b27e1b049771';
			await request(app).get(`/users/${nonExistingId}`).expect(httpStatus.NOT_FOUND);
		});

		it('should return 400 for getting with invalid user id', async () => {
			const invalidId = 'invalid-id';
			await request(app).get(`/users/${invalidId}`).expect(httpStatus.BAD_REQUEST);
		});

		it('should return 400 for updating user with invalid id', async () => {
			const invalidId = 'invalid-id';
			await request(app)
				.put(`/users/${invalidId}`)
				.send({
					email: 'updateduser@example.com',
				})
				.expect(httpStatus.BAD_REQUEST);
		});

		it('should return 404 for updating non-existing user id', async () => {
			const nonExistingId = '6740aa79f7d3b27e1b049771';
			await request(app)
				.put(`/users/${nonExistingId}`)
				.send({
					email: 'updateduser@example.com',
				})
				.expect(httpStatus.NOT_FOUND);
		});

		it('should return 404 for deleting a non-existing user', async () => {
			const nonExistingId = '6740bcfcaa86a22352cb55e2';
			await request(app).delete(`/users/${nonExistingId}`).expect(httpStatus.NOT_FOUND);
		});
	});
});