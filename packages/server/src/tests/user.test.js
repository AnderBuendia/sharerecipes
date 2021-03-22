const supertest = require('supertest');
const mongoose = require('mongoose');
const { app, server } = require('../index');
const api = supertest(app);

describe('Initial server tests', () => {
  test('should respond for health check', async () => {
    await api
      .get('/health')
      .expect(200)
      .expect('Content-Type', /text\/html/);
  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });

  test('Initial query for test graphQL server', async () => {
    await api
      .post('/graphql')
      .send({
        query: `
          query {
            hello(input: { name: "Ander", alias: "Dolan" })
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data.hello).toBe('Hello Ander, Dolan');
      });
  });
});
