require('dotenv').config();
const app = require('../app');
const request = require('supertest');

it('Add a category', async () => {
	const isAdmin = await request(app).post('/auth/login').send({
		username: process.env.ADMIN_UI_USERNAME,
		password: process.env.ADMIN_UI_PASSWORD,
	});

	let token = isAdmin.body.token;
  expect(token).toBeDefined();
	const response = await request(app).post('/categories/admin').set('Authorization', `Bearer ${token}`).send({ name: 'TEST_CATEGORY'});
		expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'Category created successfully');
});

