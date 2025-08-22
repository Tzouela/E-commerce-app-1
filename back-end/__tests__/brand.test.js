require('dotenv').config();
const app = require('../app');
const request = require('supertest');

it('Add a brand', async () => {
	const isAdmin = await request(app).post('/auth/login').send({
		username: process.env.ADMIN_UI_USERNAME,
		password: process.env.ADMIN_UI_PASSWORD,
	});

	let token = isAdmin.body.token;
  expect(token).toBeDefined();
	const response = await request(app).post('/brands/admin').set('Authorization', `Bearer ${token}`).send({ name: 'TEST_BRAND'});
		expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Brand created successfully');
});